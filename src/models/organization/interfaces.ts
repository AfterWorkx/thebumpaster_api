import { Document, Model } from 'mongoose'
import { ProfileDocument } from '../profile/interfaces'
import { UserDocument } from '../user/interfaces'
import { RoleDocument } from '../role/interfaces'
import { DocumentDocument } from '../document/interfaces'

export type Organization = {
  name: string
  userId: string
  type: string
}

export type OrganizationDocument = {
  _id: string
  profile: string | ProfileDocument
  users: Array<{ user: UserDocument | string; role: RoleDocument | string }>
  documents: Array<string | DocumentDocument>
  createdAt: string
  updatedAt: string
} & Organization &
  Document

export type OrganizationModelStatics = {
  getOrganizationsList(userId: string): Promise<Array<OrganizationDocument>>
  createOrganization(
    userId: string,
    organization: Organization
  ): Promise<OrganizationDocument>
  deleteOrganization(
    userId: string,
    id: string
  ): Promise<OrganizationDocument | null>
  setOrganizationProfile(
    userId: string,
    id: string,
    profile: string
  ): Promise<OrganizationDocument | null>
  addMemberToOrganization(
    userId: string,
    id: string,
    memberId: string,
    roleId: string
  ): Promise<OrganizationDocument | null>
  removeMemberFromOrganization(
    userId: string,
    id: string,
    memberId: string
  ): Promise<OrganizationDocument | null>
  updateMemberRoleInOrganization(
    userId: string,
    id: string,
    memberId: string,
    roleId: string
  ): Promise<OrganizationDocument | null>
}

export type IOrganizationModel = Model<OrganizationDocument> &
  OrganizationDocument &
  OrganizationModelStatics
