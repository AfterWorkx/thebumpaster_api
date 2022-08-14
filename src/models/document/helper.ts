import { FilterQuery } from 'mongoose'
import { Document, DocumentDocument, IDocumentModel } from './interfaces'

/**
 *
 * @param userId
 * @param filter
 */
export function queryDocumentsPerUser(
  userId: string,
  filter: FilterQuery<DocumentDocument>
): Promise<DocumentDocument[]> {
  const model: IDocumentModel = this
  const payload = { user: userId }
  Object.assign(payload, filter)

  return model.find(payload).exec()
}

/**
 *
 * @param userId
 * @param organizationId
 * @param documentData
 */
export function createDocument(
  userId: string,
  organizationId: string,
  documentData: Document
): Promise<DocumentDocument> {
  const model: IDocumentModel = this

  const payload = { user: userId, organization: organizationId }

  Object.assign(payload, documentData)

  return model.create(payload)
}

/**
 *
 * @param userId
 * @param organizationId
 * @param stats
 */
export function updateDocumentStats(
  userId: string,
  organizationId: string,
  stats: { file: string; size: string }
): Promise<DocumentDocument | null> {
  const model: IDocumentModel = this

  return model
    .findOneAndUpdate(
      { user: userId, organization: organizationId },
      { $set: { stats } }
    )
    .exec()
}

/**
 *
 * @param userId
 * @param organizationId
 * @param id
 */
export function deleteDocument(
  userId: string,
  organizationId: string,
  id: string
): Promise<DocumentDocument | null> {
  const model: IDocumentModel = this

  return model
    .findOneAndDelete({ user: userId, organization: organizationId, _id: id })
    .exec()
}
