import { Document as MongooseDocument, FilterQuery, Model } from 'mongoose'

export type Document = {
  type: string
  stats: {
    size: string
    file: string
  }
}

export type DocumentDocument = {
  _id: string
  user: string
  organization: string
  createdAt: string
  updatedAt: string
} & Document &
  MongooseDocument

export type DocumentModelStatics = {
  queryDocumentsPerUser(
    userId: string,
    filter: FilterQuery<DocumentDocument>
  ): Promise<DocumentDocument[]>
  createDocument(
    userId: string,
    documentData: Document,
    organizationId: string
  ): Promise<DocumentDocument>
  updateDocumentStats(
    userId: string,
    organizationId: string,
    stats: { file: string; size: string }
  ): Promise<DocumentDocument | null>
  deleteDocument(
    userId: string,
    organizationId: string,
    id: string
  ): Promise<DocumentDocument | null>
}

export type IDocumentModel = Model<DocumentDocument> &
  DocumentDocument &
  DocumentModelStatics
