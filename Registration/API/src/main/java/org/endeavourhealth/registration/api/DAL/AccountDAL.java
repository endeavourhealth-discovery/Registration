package org.endeavourhealth.registration.api.DAL;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.endeavourhealth.core.database.dal.usermanager.caching.RegionCache;
import org.endeavourhealth.core.database.dal.usermanager.caching.UserCache;
import org.endeavourhealth.core.database.dal.usermanager.models.JsonUserApplicationPolicy;
import org.endeavourhealth.core.database.dal.usermanager.models.JsonUserProject;
import org.endeavourhealth.core.database.dal.usermanager.models.JsonUserRegion;
import org.endeavourhealth.core.database.rdbms.ConnectionManager;
import org.endeavourhealth.core.database.rdbms.datasharingmanager.models.RegionEntity;
import org.endeavourhealth.core.database.rdbms.usermanager.models.UserApplicationPolicyEntity;
import org.endeavourhealth.core.database.rdbms.usermanager.models.UserProjectEntity;
import org.endeavourhealth.core.database.rdbms.usermanager.models.UserRegionEntity;
import org.endeavourhealth.registration.api.logic.AccountLogic;
import org.endeavourhealth.uiaudit.dal.UIAuditJDBCDAL;
import org.endeavourhealth.uiaudit.enums.AuditAction;
import org.endeavourhealth.uiaudit.enums.ItemType;
import org.keycloak.representations.idm.UserRepresentation;

import javax.persistence.EntityManager;

public class AccountDAL {

    public void saveAccountProject(JsonUserProject userProject) throws Exception {
        EntityManager entityManager = ConnectionManager.getUmEntityManager();

        try {
            entityManager.getTransaction().begin();
            UserProjectEntity userProjectEntity = new UserProjectEntity();
            userProjectEntity.setId(userProject.getId());
            userProjectEntity.setUserId(userProject.getUserId());
            userProjectEntity.setOrganisationId(userProject.getOrganisationId());
            userProjectEntity.setProjectId(userProject.getProjectId());
            userProjectEntity.setIsDeleted(userProject.isDeleted() ? (byte) 1 : (byte) 0);
            userProjectEntity.setIsDefault(userProject.isDefault() ? (byte) 1 : (byte) 0);
            entityManager.merge(userProjectEntity);
            entityManager.getTransaction().commit();
        } catch (Exception e) {
            entityManager.getTransaction().rollback();
            throw e;
        } finally {
            entityManager.close();
        }

        /*
        new UIAuditJDBCDAL().addToAuditTrail(userProject.getProjectId(),
                AuditAction.ADD, ItemType.USER_PROJECT, null, userProject.getId());
        }
         */
    }

    public void saveAccountRegion(JsonUserRegion userRegion, String userProjectId) throws Exception {
        EntityManager entityManager = ConnectionManager.getUmEntityManager();

        try {
            entityManager.getTransaction().begin();
            UserRegionEntity userRegionEntity = new UserRegionEntity();
            userRegionEntity.setUserId(userRegion.getUserId());
            userRegionEntity.setRegionId(userRegion.getRegionId());
            entityManager.merge(userRegionEntity);
            entityManager.getTransaction().commit();
        } catch (Exception e) {
            entityManager.getTransaction().rollback();
            throw e;
        } finally {
            entityManager.close();
        }

        //String auditJson = getAuditJsonForRegion(new UserRegionEntity(userRegion));

        /*
        new UIAuditJDBCDAL().addToAuditTrail(userProjectId,
                AuditAction.ADD, ItemType.USER_REGION, null, null, auditJson);
         */
    }

    public void saveApplicationPolicy(JsonUserApplicationPolicy userApplicationPolicy, String userProjectId) throws  Exception {

        EntityManager entityManager = ConnectionManager.getUmEntityManager();

        try {
            entityManager.getTransaction().begin();
            UserApplicationPolicyEntity userApplicationPolicyEntity = new UserApplicationPolicyEntity();
            userApplicationPolicyEntity.setUserId(userApplicationPolicy.getUserId());
            userApplicationPolicyEntity.setApplicationPolicyId(userApplicationPolicy.getApplicationPolicyId());
            entityManager.merge(userApplicationPolicyEntity);
            entityManager.getTransaction().commit();
        } catch (Exception e) {
            entityManager.getTransaction().rollback();
            throw e;
        } finally {
            entityManager.close();
        }

        /*
        String auditJson = getAuditJsonForApplicationPolicyChange(oldPolicy, new UserApplicationPolicyEntity(userApplicationPolicy));

        new UIAuditJDBCDAL().addToAuditTrail(userProjectId,
                AuditAction.EDIT, ItemType.USER_APPLICATION_POLICY, null, null, auditJson);
         */

    }

    private static String getAuditJsonForRegion(UserRegionEntity newRegion) throws Exception {
        JsonNode afterJson = generateRegionJson(newRegion);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.createObjectNode();

        ((ObjectNode)rootNode).put("title", "User region saved");

        if (afterJson != null) {
            ((ObjectNode) rootNode).set("after", afterJson);
        }

        return new AccountLogic().prettyPrintJsonString(rootNode);
    }

    private static JsonNode generateRegionJson(UserRegionEntity userRegionEntity) throws Exception {
        UserRepresentation user = UserCache.getUserDetails(userRegionEntity.getUserId());
        RegionEntity region = RegionCache.getRegionDetails(userRegionEntity.getRegionId());

        ObjectMapper mapper = new ObjectMapper();
        JsonNode auditJson = mapper.createObjectNode();

        ((ObjectNode)auditJson).put("user", user.getUsername());
        ((ObjectNode)auditJson).put("region", region.getName());

        return auditJson;
    }
}
