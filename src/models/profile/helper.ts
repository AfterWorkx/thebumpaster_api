import {IProfileModel, Profile, ProfileDocument} from "./interfaces";
import Logger from "../../services/logger";

const logger = Logger("User Model");

/**
 *
 * @param userId
 */
export function getProfileByUserId(userId: string): Promise<ProfileDocument | null> {
    logger.debug(`getProfileByUserId userId: ${userId}`);
    const model: IProfileModel = this;

    return model.findOne({user: userId}).exec();
}

/**
 *
 * @param id
 */
export function getProfileById(id: string): Promise<ProfileDocument | null> {
    logger.debug(`getProfileById id: ${id}`);
    const model: IProfileModel = this;

    return model.findById(id).exec();
}

/**
 *
 * @param userId
 * @param profile
 */
export function createProfile(userId: string, profile: Profile): Promise<ProfileDocument> {
    logger.debug(`createProfile of user: ${userId}` , profile);
    const model: IProfileModel = this;
    const payload = {};

    Object.assign(payload, profile, {user: userId})

    return model.create(payload);
}

/**
 *
 * @param id
 */
export function deleteProfileById(id: string): Promise<ProfileDocument | null> {
    logger.debug(`deleteProfileById id: ${id}`);

    const model: IProfileModel = this;

    return model.findByIdAndDelete(id).exec();

}
