import {Schema, SchemaTypes} from "mongoose";
import {createDocument, deleteDocument, queryDocumentsPerUser, updateDocumentStats} from "./helper";

export const DocumentSchema = new Schema({
    user: {
        required: true,
        type: SchemaTypes.String
    },
    organization: {
        required: true,
        type: SchemaTypes.String
    },
    type: SchemaTypes.String,
    stats: {
        size: SchemaTypes.String,
        file: SchemaTypes.String,
    },
    parent: {
        type: SchemaTypes.ObjectId,
        rel: 'document',
    }
}, {
    _id: true,
    timestamps: true,
    autoIndex: true,
    autoCreate: true
});

DocumentSchema.static("queryDocumentsPerUser", queryDocumentsPerUser);
DocumentSchema.static("createDocument", createDocument);
DocumentSchema.static("updateDocumentStats", updateDocumentStats);
DocumentSchema.static("deleteDocument", deleteDocument);
