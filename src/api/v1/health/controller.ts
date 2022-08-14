import { Request, Response } from 'express'
import { newErrorResponse, ResponseBuilder } from '../../utility/response'
import { ServerCodes } from '../../../config/constants'
import mongoose from 'mongoose'
import Logger from '../../../services/logger'

const logger = Logger('Health Controller')

/**
 *
 * @param request
 * @param response
 */
export async function getServerLiveness(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`getServerLiveness`)

  try {
    return new ResponseBuilder<Record<string, string>, Record<string, string>>(
      response
    )
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({})
      .setData({})
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
export async function getServerReadiness(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`getServerReadiness`)

  try {
    return new ResponseBuilder<{ database: boolean }, Record<string, string>>(
      response
    )
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({})
      .setData({
        database: mongoose.connection.readyState === 1,
      })
      .build()
  } catch (e) {
    return newErrorResponse(request, response, e as Error)
  }
}
