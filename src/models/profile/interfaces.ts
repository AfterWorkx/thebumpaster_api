import { Document, Model } from 'mongoose'

export type Profile = {
  firstName: string
  lastName: string
  website: string
  phone: string
  biography: string
  avatar: string
}

export type ProfileDocument = {
  _id: string
  userId: string
  createdAt: string
  updatedAt: string
} & Profile &
  Document

export type ProfileModelStatics = {
  getProfileByUserId(userId: string): Promise<ProfileDocument | null>
  getProfileById(id: string): Promise<ProfileDocument | null>
  createProfile(userId: string, profile: Profile): Promise<ProfileDocument>
  deleteProfileById(id: string): Promise<ProfileDocument | null>
}

export type IProfileModel = Model<ProfileDocument> &
  ProfileDocument &
  ProfileModelStatics
