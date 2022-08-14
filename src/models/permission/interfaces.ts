import { Document, Model } from 'mongoose'

export type Permission = {
  name: string
  references: [
    {
      type: string
      value: string
    }
  ]
}

export type PermissionDocument = {
  _id: string
  createdAt: string
  updatedAt: string
} & Permission &
  Document

// eslint-disable-next-line @typescript-eslint/ban-types
export type PermissionModelStatics = {}

export type IPermissionModel = Model<PermissionDocument> &
  PermissionDocument &
  PermissionModelStatics
