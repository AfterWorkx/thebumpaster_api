import {
    addPermissionToRole,
    createRoleInOrganization,
    deleteRoleInOrganization, getRoleInOrganization,
    queryOrganizationRoles, removePermissionFromRole
} from "./controller";
import {AbstractRouter} from "../router";

export class RoleRouter extends AbstractRouter {

    constructor() {
        super();

        RoleRouter.directory = __dirname;

        this._router.get("/roles/:organizationId/", queryOrganizationRoles);
        this._router.post("/roles/:organizationId/", createRoleInOrganization);

        this._router.get("/roles/:organizationId/:id/", getRoleInOrganization);
        this._router.delete("/roles/:organizationId/:id/", deleteRoleInOrganization);

        this._router.post("/roles/:organizationId/:id/", addPermissionToRole);
        this._router.put("/roles/:organizationId/:id/", removePermissionFromRole);

    }
}
