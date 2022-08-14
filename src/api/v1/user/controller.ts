import { Response } from 'express'
import { newErrorResponse, ResponseBuilder } from '../../utility/response'
import { ServerCodes } from '../../../config/constants'
import { UserDocument } from '../../../models/user/interfaces'
import Logger from '../../../services/logger'
import { AuthRequest } from '../../middleware/authorize'
import UserModel from '../../../models/user'
import { FilterQuery } from 'mongoose'
import { hashUserPassword } from '../../utility/crypto'
import ProfileModel from '../../../models/profile'

const logger = Logger('User Controller')

const securityProjection = { password: 0, tokens: 0 }

/**
 *
 * @param request
 * @param response
 */
export async function queryUsers(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`queryUsers`, { userData: request.auth?.userData })
  try {
    const users = await UserModel.find(
      request.query.hasOwnProperty('filter')
        ? (request.query.filter as FilterQuery<UserDocument>)
        : {},
      securityProjection
    )
      .limit(
        request.query.limit !== undefined ? Number(request.query.limit) : 100
      )
      .skip(request.query.skip !== undefined ? Number(request.query.skip) : 0)
      .populate('profile')
      .exec()

    return new ResponseBuilder<
      Array<UserDocument>,
      { query?: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ query: request.query as Record<string, string> })
      .setData(users)
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
export async function createUser(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`createUser`, { userData: request.auth?.userData })
  try {
    const user = await UserModel.createUser({
      email: request.body.email,
      password: hashUserPassword(request.body.password),
    })

    return new ResponseBuilder<
      UserDocument,
      { body?: { email: string; password: string } }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({
        body: request.body,
      })
      .setData(user)
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
export async function getUserData(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`queryUsers`, { userData: request.auth?.userData })
  try {
    const userExists = await UserModel.findById(
      request.params.id,
      securityProjection
    )
      .populate('profile')
      .exec()

    if (!userExists) {
      return newErrorResponse(request, response, {
        name: 'user.not_found',
        message: request.__('user.not_found'),
      })
    }

    return new ResponseBuilder<
      UserDocument,
      { params?: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(userExists)
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
export async function updateUserData(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`queryUsers`, { userData: request.auth?.userData })
  try {
    const userExists = await UserModel.findById(
      request.params.id,
      securityProjection
    ).exec()

    if (!userExists) {
      return newErrorResponse(request, response, {
        name: 'user.not_found',
        message: request.__('user.not_found'),
      })
    }

    if (userExists.profile) {
      Object.assign(request.body, { user: userExists._id })

      await ProfileModel.findByIdAndUpdate(userExists.profile, request.body)
    } else {
      const profile = await ProfileModel.createProfile(
        userExists._id,
        request.body
      )

      userExists.profile = profile._id
      await userExists.save()
    }

    return new ResponseBuilder<
      UserDocument,
      { params?: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(userExists)
      .build()
  } catch (e) {
    return newErrorResponse(request, response, e as Error)
  }
}
