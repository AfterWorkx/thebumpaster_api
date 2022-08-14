import {
    addMemberToOrganization,
    createNewOrganization,
    deleteOrganization,
    queryAvailableUserOrganizations, removeMemberFromOrganization, updateMemberRoleInOrganization,
    updateOrganizationProfile
} from "./controller";
import {AbstractRouter} from "../router";
import authorize from "../../middleware/authorize";

export class OrganizationRouter extends AbstractRouter {

    constructor() {
        super();

        OrganizationRouter.directory = __dirname;

        this._router.get("/organizations", authorize, queryAvailableUserOrganizations); // list

        this._router.post("/organizations", authorize, createNewOrganization); // create

        this._router.post("/organizations/:id", authorize, updateOrganizationProfile); // set Profile

        this._router.delete("/organizations/:id", authorize, deleteOrganization); // delete

        this._router.post("/organizations/:id/member", authorize, addMemberToOrganization); // add Member

        this._router.put("/organizations/:id/member", authorize, updateMemberRoleInOrganization); // update Member

        this._router.delete("/organizations/:id/member", authorize, removeMemberFromOrganization); // remove Member


    }
}
