import { Request, Response, NextFunction } from 'express'
import { newErrorResponse, ResponseBuilder } from '../utility/response'
import { ServerCodes } from '../../config/constants'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserDocument } from '../../models/user/interfaces'
import OrganizationModel from '../../models/organization'

export type AuthRequest = {
  auth?: {
    userData: Record<string, string>
    token: string
  }
} & Request

export const newUnauthorizedResponse = (response: Response) => {
  return new ResponseBuilder<{ message: string }, undefined>(response)
    .setData({
      message: 'Valid JWT authorization token is required.',
    })
    .setStatus(ServerCodes.UNAUTHORIZED)
    .build()
}

export const generateJWT = (user: UserDocument): Promise<false | string> => {
  return new Promise(async (resolve, reject) => {
    const tokenPayload = {}

    try {
      const organizations = await OrganizationModel.getOrganizationsList(
        user._id
      )

      Object.assign(
        tokenPayload,
        {
          userId: user._id,
          userEmail: user.email,
        },
        {
          organizations: organizations.map((organization) => {
            return { id: organization._id, name: organization.name }
          }),
        }
      )

      jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET !== undefined
          ? process.env.JWT_SECRET
          : 'CatsAndDogs',
        {
          expiresIn:
            process.env.JWT_EXPIRY !== undefined
              ? process.env.JWT_EXPIRY
              : '1h',
          issuer:
            process.env.JWT_ISSUER !== undefined
              ? process.env.JWT_ISSUER
              : 'http://localhost',
          audience:
            process.env.JWT_AUDIENCE !== undefined
              ? process.env.JWT_AUDIENCE
              : 'http://localhost',
        },
        (error, encoded) => {
          if (error) {
            reject(error)
          }
          if (encoded !== undefined) {
            resolve(encoded)
          } else {
            resolve(false)
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

export const verifyJWT = (
  token: string
): Promise<false | JwtPayload | string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET !== undefined
        ? process.env.JWT_SECRET
        : 'CatsAndDogs',
      {
        issuer:
          process.env.JWT_ISSUER !== undefined
            ? process.env.JWT_ISSUER
            : 'http://localhost',
        audience:
          process.env.JWT_AUDIENCE !== undefined
            ? process.env.JWT_AUDIENCE
            : 'http://localhost',
      },
      (error, payload) => {
        if (error) {
          reject(error)
        }

        if (payload !== undefined) {
          resolve(payload)
        } else {
          resolve(false)
        }
      }
    )
  })
}

export default function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!request.header('Authorization')) {
    return newUnauthorizedResponse(response)
  }

  // Validate token
  const [bearer, token] = (request.header('Authorization') as string).split(' ')

  if (bearer !== 'Bearer' || !token) {
    return newUnauthorizedResponse(response)
  }

  verifyJWT(token)
    .then((payload) => {
      Object.assign(request, { auth: { userData: payload, token } })

      next()
    })
    .catch((error) => {
      return newErrorResponse(request, response, error)
    })
}
