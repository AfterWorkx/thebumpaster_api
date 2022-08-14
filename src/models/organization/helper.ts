import {IOrganizationModel, Organization, OrganizationDocument} from "./interfaces";
import Logger from "../../services/logger";

const logger = Logger("Organization Model");

/**
 *
 */
export function getOrganizationsList(userId: string): Promise<Array<OrganizationDocument>> {
    logger.debug(`getOrganizationsList`);

    const model: IOrganizationModel = this;

    return model.find({userId}).populate("users").exec()
}

/**
 *
 * @param userId
 * @param organization
 */
export function createOrganization(userId: string, organization: Organization): Promise<OrganizationDocument> {
    logger.debug(`createOrganization userId: ${userId}`);

    const model: IOrganizationModel = this;

    const payload = {userId};

    Object.assign(payload, organization);

    return model.create(payload)
}

/**
 *
 * @param userId
 * @param id
 */
export function deleteOrganization(userId: string, id: string): Promise<OrganizationDocument | null> {
    logger.debug(`deleteOrganization userId: ${userId} id: ${id}`);

    const model: IOrganizationModel = this;

    return model.findOneAndDelete({userId, _id: id}).exec();
}

/**
 *
 * @param userId
 * @param id
 * @param profile
 */
export function setOrganizationProfile(userId: string, id: string, profile: string): Promise<OrganizationDocument | null> {
    logger.debug(`setOrganizationProfile userId: ${userId} id: ${id}`);

    const model: IOrganizationModel = this;

    return model.findByIdAndUpdate(id, {$set: {profile}}).exec();
}

/**
 *
 * @param userId
 * @param id
 * @param memberId
 * @param roleId
 */
export function addMemberToOrganization(userId: string, id: string, memberId: string, roleId: string): Promise<OrganizationDocument | null> {
    logger.debug(`addMemberToOrganization userId: ${userId} id: ${id} memberId: ${memberId} roleId: ${roleId}`);

    const model: IOrganizationModel = this;

    return model.findOneAndUpdate({userId, _id: id}, {$push: { users: {user: memberId, role: roleId} }}).exec();

}

/**
 *
 * @param userId
 * @param id
 * @param memberId
 */
export function removeMemberFromOrganization(userId: string, id: string, memberId: string): Promise<OrganizationDocument | null> {
    logger.debug(`removeMemberFromOrganization userId: ${userId} id: ${id} memberId: ${memberId}`);

    const model: IOrganizationModel = this;

    return model.findOneAndUpdate({userId, _id: id}, {$pull: { users: {user: memberId} }}).exec();
}

/**
 *
 * @param userId
 * @param id
 * @param memberId
 * @param roleId
 */
export function updateMemberRoleInOrganization(userId: string, id: string, memberId: string, roleId: string): Promise<OrganizationDocument | null> {
    logger.debug(`updateMemberRoleInOrganization userId: ${userId} id: ${id} memberId: ${memberId} roleId: ${roleId}`);

    const model: IOrganizationModel = this;

    return model.findOneAndUpdate({userId, _id: id, "users.user": memberId}, { "users.$.role": roleId }).exec();

}
