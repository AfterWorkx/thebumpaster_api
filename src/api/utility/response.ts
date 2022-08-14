import { NextFunction, Request, Response } from 'express'
import { ResponseCodes, ServerCodes } from '../../config/constants'

/**
 *
 */
export class ResponseBuilder<T, K> {
  private body?: T
  private meta?: K
  private errors?: Array<IErrorMessage>
  private statusCode?: ResponseCodes

  private response: Response

  constructor(response: Response) {
    this.response = response
  }

  public setData(data: T) {
    this.body = data

    return this
  }

  public setMeta(data: K) {
    this.meta = data

    return this
  }

  public setStatus(code: ResponseCodes) {
    this.statusCode = code

    return this
  }

  public setError(...error: IErrorMessage[]) {
    this.errors = [...error]

    return this
  }

  public build() {
    this.response.status(this.statusCode as number)

    const payload = {}

    if (this.meta !== undefined) {
      Object.assign(payload, { meta: this.meta })
    }

    if (this.body !== undefined) {
      Object.assign(payload, { result: this.body })
    }

    if (this.errors !== undefined) {
      Object.assign(payload, { errors: this.errors })
    }

    return this.response.json(payload)
  }
}

/**
 *
 */
export type IErrorMessage = {
  code: number
  message: string
  trace?: Array<Error>
}

/**
 *
 * @param request
 * @param response
 * @param errors
 */
export function newErrorResponse(
  request: Request,
  response: Response,
  ...errors: Error[]
) {
  const metaPayload = {}

  if (Object.keys(request.params).length > 0) {
    Object.assign(metaPayload, { params: request.params })
  }

  if (Object.keys(request.query).length > 0) {
    Object.assign(metaPayload, { query: request.query })
  }

  if (Object.keys(request.body).length > 0) {
    Object.assign(metaPayload, { body: request.body })
  }

  const errorMessage: IErrorMessage = {
    code: ServerCodes.ERROR,
    message: request.__('internal_server_error'),
    trace: [...errors],
  }

  return new ResponseBuilder(response)
    .setStatus(ServerCodes.ERROR)
    .setMeta(metaPayload)
    .setError(errorMessage)
    .build()
}

export function newNotFoundResponse(request: Request, response: Response) {
  const metaPayload = {}

  Object.assign(metaPayload, {
    method: request.method,
    path: request.path,
    baseUrl: request.baseUrl,
  })

  if (Object.keys(request.params).length > 0) {
    Object.assign(metaPayload, { params: request.params })
  }

  if (Object.keys(request.query).length > 0) {
    Object.assign(metaPayload, { query: request.query })
  }

  if (Object.keys(request.body).length > 0) {
    Object.assign(metaPayload, { body: request.body })
  }

  return new ResponseBuilder(response)
    .setStatus(ServerCodes.NOTFOUND)
    .setMeta(metaPayload)
    .setData({
      message: request.__('resource_not_found'),
    })
    .build()
}

/**
 *
 * @param error
 * @param request
 * @param response
 * @param _next
 */
export function errorHandler(
  error: null | Record<string, unknown> | Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  return newErrorResponse(request, response, error as Error)
}

export function notFoundHandler(request: Request, response: Response) {
  return newNotFoundResponse(request, response)
}
