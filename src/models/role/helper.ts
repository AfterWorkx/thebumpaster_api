import {IRoleModel, Role, RoleDocument} from "./interfaces";
import Logger from "../../services/logger";

const logger = Logger("Role Model");

/**
 *
 * @param organizationId
 */
export function getRoleListOfOrganization(organizationId: string): Promise<Array<RoleDocument>> {
    logger.debug(`getRoleListOfOrganization organizationId: ${organizationId}`);

    const model: IRoleModel = this;

    return model.find({organizationId}).exec();
}

/**
 *
 * @param organizationId
 * @param role
 */
export function createNewRole(organizationId: string, role: Role): Promise<RoleDocument> {
    logger.debug(`createNewRole organizationId: ${organizationId}`);

    const model: IRoleModel = this;

    const payload = {organizationId}

    Object.assign(payload, role);

    return model.create(payload)
}

/**
 *
 * @param id
 */
export function deleteRole(id: string): Promise<RoleDocument | null> {
    logger.debug(`deleteRole id: ${id}`);

    const model: IRoleModel = this;

    return model.findByIdAndDelete(id).exec();
}

/**
 *
 * @param organizationId
 * @param id
 * @param permissionId
 */
export function addPermissionToRole(organizationId: string, id: string, permissionId: string): Promise<RoleDocument | null> {
    logger.debug(`addPermissionToRole organizationId: ${organizationId} id: ${id}`);

    const model: IRoleModel = this;

    return model.findOneAndUpdate({_id: id, organizationId}, { $push: { permissions: permissionId }}).exec();
}

/**
 *
 * @param organizationId
 * @param id
 * @param permissionId
 */
export function removePermissionFromRole(organizationId: string, id: string, permissionId: string): Promise<RoleDocument | null> {
    logger.debug(`removePermissionFromRole organizationId: ${organizationId} id: ${id}`);

    const model: IRoleModel = this;

    return model.findOneAndUpdate({_id: id, organizationId}, { $pull: { permissions: permissionId }}).exec();
}

/**
 *
 * @param organizationId
 * @param id
 * @param permissions
 */
export function setPermissionsToRole(organizationId: string, id: string, permissions: string[]): Promise<RoleDocument | null> {
    logger.debug(`setPermissionsToRole organizationId: ${organizationId} id: ${id}`);

    const model: IRoleModel = this;

    return model.findOneAndUpdate({_id: id, organizationId}, { $set: { permissions }}).exec();
}

