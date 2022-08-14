import {Schema, SchemaTypes} from "mongoose";
import {
    addPermissionToRole,
    createNewRole,
    deleteRole,
    getRoleListOfOrganization,
    removePermissionFromRole, setPermissionsToRole
} from "./helper";

export const RoleSchema = new Schema({
    name: {
        required: true,
        type: SchemaTypes.String
    },
    organizationId: {
        required: true,
        type: SchemaTypes.String
    },
    permissions: [
        {
            type: SchemaTypes.ObjectId,
            rel: 'permission'
        }
    ]
}, {
    _id: true,
    timestamps: true,
    autoIndex: true,
    autoCreate: true
})

RoleSchema.static("getRoleListOfOrganization", getRoleListOfOrganization);
RoleSchema.static("createNewRole", createNewRole);
RoleSchema.static("deleteRole", deleteRole);
RoleSchema.static("addPermissionToRole", addPermissionToRole);
RoleSchema.static("removePermissionFromRole", removePermissionFromRole);
RoleSchema.static("setPermissionsToRole", setPermissionsToRole);
