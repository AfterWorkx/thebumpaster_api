import { Request, Response } from 'express'
import { newErrorResponse, ResponseBuilder } from '../../utility/response'
import { ServerCodes } from '../../../config/constants'
import Logger from '../../../services/logger'
import { AuthRequest, generateJWT } from '../../middleware/authorize'
import UserModel from '../../../models/user'
import {
  hashUserPassword,
  newSessionToken,
  UserTokens,
  verifyUserPassword,
} from '../../utility/crypto'
import { UserDocument } from '../../../models/user/interfaces'

const logger = Logger('Auth Controller')
/**
 *
 * @param request
 * @param response
 */
export async function singIn(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`singIn`)

  try {
    // Find the user
    const userExists = (await UserModel.getUserByEmail(
      request.body.email
    )) as UserDocument

    if (!userExists) {
      return newErrorResponse(request, response, {
        name: 'user.not_found',
        message: request.__('user.not_found'),
      })
    }

    // Verify password
    if (!verifyUserPassword(request.body.password, userExists.password)) {
      return newErrorResponse(request, response, {
        name: 'wrong_password',
        message: request.__('user.wrong_password'),
      })
    }

    // Generate jwt & session token
    const sessionToken = newSessionToken()

    if (
      userExists.tokens.filter(({ name }) => name === UserTokens.SESSION_TOKEN)
        .length > 0
    ) {
      await UserModel.updateToken(userExists._id, {
        name: UserTokens.SESSION_TOKEN,
        value: sessionToken,
      })
    } else {
      await UserModel.addToken(userExists._id, {
        name: UserTokens.SESSION_TOKEN,
        value: sessionToken,
      })
    }

    const jwt = (await generateJWT(userExists)) as string

    return new ResponseBuilder<
      { sessionToken: string; jwt: string },
      { body?: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ body: request.body })
      .setData({ sessionToken, jwt })
      .build()
  } catch (e) {
    return newErrorResponse(request, response, e as Error)
  }
}

export async function register(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`register`)

  try {
    // Find the user
    const userExists = (await UserModel.getUserByEmail(
      request.body.email
    )) as null

    if (userExists) {
      return newErrorResponse(request, response, {
        name: 'user.found',
        message: request.__('user.found'),
      })
    }

    const registeredUser = await UserModel.createUser({
      email: request.body.email,
      password: hashUserPassword(request.body.password),
    })

    return new ResponseBuilder<UserDocument, undefined>(response)
      .setStatus(ServerCodes.CREATED)
      .setData(registeredUser)
      .build()
  } catch (e) {
    return newErrorResponse(request, response, e as Error)
  }
}

/**
 *
 * @param request
 * @param response
 */
export async function authCheck(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`authCheck`, { userData: request.auth?.userData })
  try {
    const sessionToken = request.header('Session-Key')

    if (sessionToken === undefined) {
      return newErrorResponse(request, response, {
        name: 'invalid_session_key',
        message: request.__('invalid_session_key'),
      })
    }

    const user = await UserModel.getUserById(
      request.auth?.userData.userId as string
    )

    if (!user) {
      return newErrorResponse(request, response, {
        name: 'user.not_found',
        message: request.__('user.not_found'),
      })
    }

    const matchedSessions = user.tokens.filter(
      ({ name, value }) =>
        name === UserTokens.SESSION_TOKEN && value === sessionToken
    )

    if (matchedSessions.length === 0) {
      return newErrorResponse(request, response, {
        name: 'user.session_expired',
        message: request.__('user.session_expired'),
      })
    }

    return new ResponseBuilder<{ token?: string }, Record<string, string>>(
      response
    )
      .setStatus(ServerCodes.SUCCESS)
      .setData({
        token: (await generateJWT(user)) as string,
      })
      .build()
  } catch (e) {
    return newErrorResponse(request, response, e as Error)
  }
}
