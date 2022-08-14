import {IUserModel, User, UserDocument} from "./interfaces";
import Logger from "../../services/logger";

const logger = Logger("User Model");

/**
 *
 * @param id
 */
export function getUserById(id: string): Promise<UserDocument | null> {
    logger.debug(`getUserById id: ${id}`);
    const model: IUserModel = this;

    return model.findById(id).exec();
}

/**
 *
 * @param email
 */
export function getUserByEmail(email: string): Promise<UserDocument | null> {
    logger.debug(`getUserByEmail email: ${email}`);
    const model: IUserModel = this;

    return model.findOne({email}).exec();
}

/**
 *
 * @param user
 */
export function createUser(user: User): Promise<UserDocument> {
    logger.debug(`createUser email: ${user.email}`, user);

    const model: IUserModel = this;

    return model.create(user);
}

/**
 *
 * @param email
 */
export function deleteUserByEmail(email: string): Promise<UserDocument | null> {
    logger.debug(`deleteUserByEmail email: ${email}`);

    const model: IUserModel = this;

    return model.findOneAndDelete({email}).exec();

}

/**
 *
 * @param id
 */
export function deleteUserById(id: string): Promise<UserDocument | null> {
    logger.debug(`deleteUserById id: ${id}`);

    const model: IUserModel = this;

    return model.findByIdAndDelete(id).exec();

}

/**
 *
 * @param id
 * @param token
 */
export function addToken(id: string, token: {name: string, value: string}): Promise<UserDocument | null> {
    logger.debug(`addToken id: ${id}`, {token});
    const model: IUserModel = this;

    const _token = {
        name: token.name,
        value: token.value,
        createdAt: new Date(),
    };

    return model.findByIdAndUpdate(id, { $push: {tokens: _token} }).exec();
}

/**
 *
 * @param id
 * @param token
 */
export function updateToken(id: string, token: {name: string, value: string}): Promise<UserDocument | null> {
    logger.debug(`updateToken id: ${id}`, {token});

    const model: IUserModel = this;

    return model.findOneAndUpdate({_id: id, "tokens.name": token.name}, { $set: {"tokens.$.value": token.value, "tokens.$.createdAt": new Date()} }).exec();
}

/**
 *
 * @param id
 * @param tokenName
 */
export function removeToken(id: string, tokenName: string): Promise<UserDocument | null> {
    logger.debug(`removeToken id: ${id}`, {tokenName});

    const model: IUserModel = this;

    return model.findByIdAndUpdate(id, { $pull: { tokens: { name: tokenName } } }).exec();
}


