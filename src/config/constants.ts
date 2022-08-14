export enum ServerCodes {
    SUCCESS = 200,
    CREATED = 201,
    UPDATED = 204,
    INVALID = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOTFOUND = 404,
    ERROR = 500,
}

export type ResponseCodes = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500

export const memory_limit = "501Mb"
