import {pbkdf2Sync, randomBytes} from "crypto";

const salt = process.env.PASSWORD_SALT !== undefined ? process.env.PASSWORD_SALT : "9ab248dc0b6dcf742b4f3c1b002243f6"

export const hashUserPassword = (password: string) => {
    return pbkdf2Sync(password, salt, 1024, 64, 'sha512').toString("hex")
}

export const verifyUserPassword = (password: string, hash: string) => {
    return pbkdf2Sync(password, salt, 1024, 64, 'sha512').toString("hex") === hash;
}

export const newSessionToken = () => {
    return randomBytes(64).toString('hex')
}

export enum UserTokens {
    SESSION_TOKEN = 'session_token',
    JWT_TOKEN = 'json_web_token'
}
