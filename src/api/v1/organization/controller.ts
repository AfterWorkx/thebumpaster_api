import { Response } from 'express'
import { newErrorResponse, ResponseBuilder } from '../../utility/response'
import { ServerCodes } from '../../../config/constants'
import Logger from '../../../services/logger'
import { AuthRequest } from '../../middleware/authorize'
import { OrganizationDocument } from '../../../models/organization/interfaces'
import OrganizationModel from '../../../models/organization'
import ProfileModel from '../../../models/profile'

const logger = Logger('Organization Controller')

/**
 *
 * @param request
 * @param response
 */
export async function queryAvailableUserOrganizations(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`queryAvailableUserOrganizations`)

  try {
    const filter = {}

    if (request.query.hasOwnProperty('filter')) {
      Object.assign(filter, request.query.filter)
    }

    Object.assign(filter, { userId: request.auth?.userData?.userId })

    const organizations = await OrganizationModel.find(filter)
      .limit(
        request.query.limit !== undefined ? Number(request.query.limit) : 100
      )
      .skip(request.query.skip !== undefined ? Number(request.query.skip) : 0)
      .populate('documents')
      .populate('users.user')
      .populate('users.role')
      .exec()

    return new ResponseBuilder<
      Array<OrganizationDocument>,
      Record<string, string>
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({})
      .setData(organizations)
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
export async function createNewOrganization(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`createNewOrganization`)

  try {
    const organization = await OrganizationModel.createOrganization(
      request.auth?.userData.userId as string,
      request.body
    )

    return new ResponseBuilder<
      OrganizationDocument,
      { body: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ body: request.body })
      .setData(organization)
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
export async function updateOrganizationProfile(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`updateOrganizationProfile`)

  try {
    // Check if has a profile
    const organizationExists = await OrganizationModel.findOne({
      userId: request.auth?.userData.userId,
      _id: request.params.id,
    }).exec()

    if (!organizationExists) {
      return newErrorResponse(request, response, {
        name: 'organization.not_found',
        message: request.__('organization.not_found'),
      })
    }

    const profileExists = await ProfileModel.findById(
      organizationExists.profile
    ).exec()

    // update profile
    if (profileExists) {
      await ProfileModel.findByIdAndUpdate(
        organizationExists.profile,
        request.body
      )

      return new ResponseBuilder<
        OrganizationDocument,
        { body: Record<string, string> }
      >(response)
        .setStatus(ServerCodes.SUCCESS)
        .setMeta({ body: request.body })
        .setData(organizationExists)
        .build()
    }

    // create new profile
    const profile = await ProfileModel.createProfile(
      request.auth?.userData.userId as string,
      request.body
    )
    // update organization

    const organization = (await OrganizationModel.setOrganizationProfile(
      request.auth?.userData.userId as string,
      organizationExists._id,
      profile._id
    )) as OrganizationDocument

    return new ResponseBuilder<
      OrganizationDocument,
      { body: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ body: request.body })
      .setData(organization)
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
export async function deleteOrganization(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`deleteOrganization`)

  try {
    const organization = await OrganizationModel.deleteOrganization(
      request.auth?.userData.userId as string,
      request.params.id
    )

    return new ResponseBuilder<
      OrganizationDocument,
      { params: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ params: request.params })
      .setData(organization as OrganizationDocument)
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
export async function addMemberToOrganization(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`addMemberToOrganization`)

  try {
    const { member, role } = request.body

    const organization = (await OrganizationModel.addMemberToOrganization(
      request.auth?.userData.userId as string,
      request.params.id,
      member,
      role
    )) as OrganizationDocument

    return new ResponseBuilder<
      OrganizationDocument,
      { body: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ body: request.body })
      .setData(organization)
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
export async function updateMemberRoleInOrganization(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`updateMemberRoleInOrganization`)

  try {
    const { member, role } = request.body

    const organization =
      (await OrganizationModel.updateMemberRoleInOrganization(
        request.auth?.userData.userId as string,
        request.params.id,
        member,
        role
      )) as OrganizationDocument

    return new ResponseBuilder<
      OrganizationDocument,
      { body: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ body: request.body })
      .setData(organization)
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
export async function removeMemberFromOrganization(
  request: AuthRequest,
  response: Response
): Promise<Response> {
  logger.debug(`removeMemberFromOrganization`)

  try {
    const { member } = request.body

    const organization = (await OrganizationModel.removeMemberFromOrganization(
      request.auth?.userData.userId as string,
      request.params.id,
      member
    )) as OrganizationDocument

    return new ResponseBuilder<
      OrganizationDocument,
      { body: Record<string, string> }
    >(response)
      .setStatus(ServerCodes.SUCCESS)
      .setMeta({ body: request.body })
      .setData(organization)
      .build()
  } catch (e) {
    return newErrorResponse(request, response, e as Error)
  }
}
