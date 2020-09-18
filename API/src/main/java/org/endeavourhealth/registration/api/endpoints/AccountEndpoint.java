package org.endeavourhealth.registration.api.endpoints;

import com.codahale.metrics.annotation.Timed;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.endeavourhealth.common.security.annotations.RequiresAdmin;
import org.endeavourhealth.registration.api.logic.AccountLogic;
import org.endeavourhealth.registration.api.models.JsonAccount;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/account")
@Api(description = "API endpoint related to Account registration")
public class AccountEndpoint {

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Timed(absolute = true, name="DiscoverExplorer.AccountEndpoint.post")
    @Path("/")
    @ApiOperation(value = "Register a new Discovery account.  Accepts a JSON representation of an account.")
    @RequiresAdmin
    public Response post(@ApiParam(value = "Json representation of the account to save ") JsonAccount account) throws Exception {
        return new AccountLogic().createAccount(account);
    }
}

