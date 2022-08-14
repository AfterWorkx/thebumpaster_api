import { Document, Model } from 'mongoose'
import { ProfileDocument } from '../profile/interfaces'

export type User = {
  email: string
  password: string
}

export type UserDocument = {
  _id: string
  tokens: Array<{ name: string; value: string; createdAt: string }>
  profile: ProfileDocument | string
  createdAt: string
  updatedAt: string
} & User &
  Document

export type UserModelStatics = {
  getUserById(id: string): Promise<UserDocument | null>
  getUserByEmail(email: string): Promise<UserDocument | null>

  createUser(user: User): Promise<UserDocument>

  addToken(
    id: string,
    token: { name: string; value: string }
  ): Promise<UserDocument | null>
  updateToken(
    id: string,
    token: { name: string; value: string }
  ): Promise<UserDocument | null>
  removeToken(id: string, tokenName: string): Promise<UserDocument | null>

  deleteUserByEmail(email: string): Promise<unknown>
  deleteUserById(id: string): Promise<unknown>
}

export type IUserModel = Model<UserDocument> & UserDocument & UserModelStatics
