import { Document, Model } from 'mongoose'
import { Permission } from '../permission/interfaces'

export type Role = {
  name: string
  permissions: Array<Permission | string>
}

export type RoleDocument = {
  _id: string
  organizationId: string
  createdAt: string
  updatedAt: string
} & Role &
  Document

export type RoleModelStatics = {
  getRoleListOfOrganization(
    organizationId: string
  ): Promise<Array<RoleDocument>>
  createNewRole(organizationId: string, role: Role): Promise<RoleDocument>
  deleteRole(organizationId: string, id: string): Promise<RoleDocument | null>
  addPermissionToRole(
    organizationId: string,
    id: string,
    permissionId: string
  ): Promise<RoleDocument | null>
  removePermissionFromRole(
    organizationId: string,
    id: string,
    permissionId: string
  ): Promise<RoleDocument | null>
  setPermissionsToRole(
    organizationId: string,
    id: string,
    permissions: string[]
  ): Promise<RoleDocument | null>
}

export type IRoleModel = Model<RoleDocument> & RoleDocument & RoleModelStatics
