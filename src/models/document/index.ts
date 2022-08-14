import {model} from "mongoose";
import {DocumentSchema} from "./schema";
import {IDocumentModel, DocumentDocument} from "./interfaces";

const DocumentModel: IDocumentModel = model<DocumentDocument>("document", DocumentSchema, "documents") as IDocumentModel;

export default DocumentModel
