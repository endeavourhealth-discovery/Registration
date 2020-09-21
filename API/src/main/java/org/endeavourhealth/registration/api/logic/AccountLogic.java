package org.endeavourhealth.registration.api.logic;

import com.amazonaws.util.StringUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.endeavourhealth.common.config.ConfigManager;
import org.endeavourhealth.common.security.keycloak.client.KeycloakAdminClient;
import org.endeavourhealth.core.database.dal.usermanager.models.JsonUserApplicationPolicy;
import org.endeavourhealth.core.database.dal.usermanager.models.JsonUserProject;
import org.endeavourhealth.core.database.dal.usermanager.models.JsonUserRegion;
import org.endeavourhealth.registration.api.DAL.AccountDAL;
import org.endeavourhealth.registration.api.models.JsonAccount;
import org.endeavourhealth.uiaudit.dal.UIAuditJDBCDAL;
import org.endeavourhealth.uiaudit.enums.AuditAction;
import org.endeavourhealth.uiaudit.enums.ItemType;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AccountLogic {

    private static final Logger LOG = LoggerFactory.getLogger(AccountLogic.class);

    public Response createAccount(JsonAccount account) throws Exception {

        String organisationId = "";
        String projectId = "";
        String applicationPolicyId = "";
        String regionId = "";

        try {
            JsonNode node = ConfigManager.getConfigurationAsJson("settings");
            organisationId = node.get("organisation_id").textValue();
            projectId = node.get("project_id").textValue();
            applicationPolicyId = node.get("application_policy_id").textValue();
            regionId = node.get("region_id").textValue();
            if (StringUtils.isNullOrEmpty(organisationId) ||
                    StringUtils.isNullOrEmpty(projectId) ||
                    StringUtils.isNullOrEmpty(applicationPolicyId) ||
                    StringUtils.isNullOrEmpty(regionId)) {
                throw new Exception("Missing values");
            }
        } catch (Exception e) {
            LOG.info("organisation id:" + organisationId);
            LOG.info("project id:" + projectId);
            LOG.info("application policy id:" + applicationPolicyId);
            LOG.info("region id:" + regionId);
            LOG.error("Required setting/s are missing. Please contact system administrator.");
            account.setErrorMessage("Required setting/s are missing. Please contact system administrator.");
            return Response
                    .ok()
                    .entity(account)
                    .build();
        }

        //Create the keycloak admin client and file the user
        KeycloakAdminClient keycloakClient = new KeycloakAdminClient();
        java.util.List<UserRepresentation> users = keycloakClient.realms().users().getUsers("", 0, 100);
        for (UserRepresentation user : users) {
            if (account.getUserId().equalsIgnoreCase(user.getEmail())) {
                account.setErrorMessage("Account already exists.");
                return Response
                        .ok()
                        .entity(account)
                        .build();
            }
        }

        UserRepresentation userRep = new UserRepresentation();
        userRep.setEnabled(true);
        userRep.setUsername(account.getUserId());
        userRep.setLastName(account.getSurname());
        userRep.setFirstName(account.getForename());
        userRep.setEmail(account.getUserId());
        userRep.singleAttribute("organisation-id", organisationId);

        try {
            //Set the basic user profile info
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(account.getPassword());
            credential.setTemporary(true);
            List<CredentialRepresentation> credentials = new ArrayList<>();
            credentials.add(credential);
            userRep.setCredentials(credentials);

            userRep = keycloakClient.realms().users().postUser(userRep);

            //auditUserAdd(userRep, projectId);
        } catch (Exception e) {
            LOG.error("Error occurred while posting to keycloack: " + e.getMessage());
            throw e;
        }

        try {
            JsonUserProject userProject = new JsonUserProject();
            userProject.setId(UUID.randomUUID().toString());

            userProject.setUserId(userRep.getId());
            userProject.setOrganisationId(organisationId);
            userProject.setProjectId(projectId);
            userProject.setDeleted(false);
            userProject.setDefault(false);

            AccountDAL dal = new AccountDAL();
            dal.saveAccountProject(userProject);

            JsonUserRegion region = new JsonUserRegion();
            region.setRegionId(regionId);
            region.setUserId(userRep.getId());
            dal.saveAccountRegion(region, projectId);

            JsonUserApplicationPolicy userApplicationPolicy = new JsonUserApplicationPolicy();
            userApplicationPolicy.setUserId(userRep.getId());
            userApplicationPolicy.setApplicationPolicyId(applicationPolicyId);
            dal.saveApplicationPolicy(userApplicationPolicy, projectId);
        }
        catch (Exception e) {
            LOG.error("Error occurred setting project/region/application policy: " + e.getMessage());
            LOG.error("Deleting previously created keycloak user: " + userRep.getUsername());
            keycloakClient.realms().users().deleteUser(userRep.getId());
            throw e;
        }
        try {
            keycloakClient.realms().users().putUserUpdatePasswordEmail(userRep);
            LOG.info("Account Id: " + userRep.getId());
        }
        catch (Exception e) {
            LOG.error("Error occurred sending the update password email: " + e.getMessage());
            LOG.error("Deleting previously created keycloak user: " + userRep.getUsername());
            keycloakClient.realms().users().deleteUser(userRep.getId());
            throw e;
        }

        account.setErrorMessage(null);
        return Response
                .ok()
                .entity(account)
                .build();
    }

    private void auditUserAdd(UserRepresentation newUser, String userRoleId) throws Exception {

        JsonNode afterJson = generateUserAuditJson(newUser);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.createObjectNode();

        ((ObjectNode)rootNode).put("title", "User added");

        if (afterJson != null) {
            ((ObjectNode) rootNode).set("after", afterJson);
        }

        new UIAuditJDBCDAL().addToAuditTrail(userRoleId,
                AuditAction.ADD,
                ItemType.USER, null, null, prettyPrintJsonString(rootNode));

    }

    private JsonNode generateUserAuditJson(UserRepresentation user) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        JsonNode auditJson = mapper.createObjectNode();

        ((ObjectNode)auditJson).put("id", user.getId());
        ((ObjectNode)auditJson).put("username", user.getUsername());
        ((ObjectNode)auditJson).put("forename", user.getFirstName());
        ((ObjectNode)auditJson).put("surname", user.getLastName());
        ((ObjectNode)auditJson).put("email", user.getEmail());

        return auditJson;
    }

    public static String prettyPrintJsonString(JsonNode jsonNode) throws Exception {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Object json = mapper.readValue(jsonNode.toString(), Object.class);
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);
        } catch (Exception e) {
            throw new Exception("Converting Json to String failed : " + e.getMessage() );
        }
    }
}
