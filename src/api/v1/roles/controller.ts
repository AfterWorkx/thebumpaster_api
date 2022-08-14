import { Request, Response } from 'express'
import { newErrorResponse, ResponseBuilder } from '../../utility/response'
import { ServerCodes } from '../../../config/constants'
import Logger from '../../../services/logger'
import { AuthRequest } from '../../middleware/authorize'
import RoleModel from '../../../models/role'
import { RoleDocument } from '../../../models/role/interfaces'
import PermissionModel from '../../../models/permission'

const logger = Logger('Role Controller')

/**
 *
 * @param request
 * @param response
 */
export async function queryOrganizationRoles(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`queryOrganizationRoles`)
  try {
    const roles = await RoleModel.getRoleListOfOrganization(
      request.params.organizationId
    )

    return new ResponseBuilder<
      RoleDocument[],
      { params: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(roles)
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
export async function createRoleInOrganization(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`createRoleInOrganization`)

  try {
    const role = await RoleModel.createNewRole(
      request.params.organizationId,
      request.body
    )

    return new ResponseBuilder<
      RoleDocument,
      { params: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(role)
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
export async function getRoleInOrganization(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`getRoleInOrganization`)

  try {
    const role = await RoleModel.findOne({
      organizationId: request.params.organizationId,
      _id: request.params.id,
    }).exec()

    return new ResponseBuilder<
      RoleDocument,
      { params: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(role as RoleDocument)
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
export async function deleteRoleInOrganization(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`deleteRoleInOrganization`)

  try {
    const role = await RoleModel.deleteRole(
      request.params.organizationId,
      request.params.id
    )

    return new ResponseBuilder<
      RoleDocument,
      { params: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(role as RoleDocument)
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
export async function addPermissionToRole(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`addPermissionToRole`)

  try {
    // create new permission
    const permission = await PermissionModel.create(request.body)

    const role = await RoleModel.addPermissionToRole(
      request.params.organizationId,
      request.params.id,
      permission._id
    )

    return new ResponseBuilder<
      RoleDocument,
      { params: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(role as RoleDocument)
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
export async function removePermissionFromRole(
  request: Request,
  response: Response
): Promise<Response> {
  logger.debug(`removePermissionToRole`)

  try {
    // create new permission
    const permission = await PermissionModel.findById(
      request.body.permissionId
    ).exec()

    const role = await RoleModel.removePermissionFromRole(
      request.params.organizationId,
      request.params.id,
      permission?._id as string
    )

    return new ResponseBuilder<
      RoleDocument,
      { params: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(role as RoleDocument)
      .build()
  } catch (e) {
    return newErrorResponse(request, response, e as Error)
  }
}
