import {Schema, SchemaTypes} from "mongoose";

export const PermissionSchema = new Schema({
    name: {
        required: true,
        type: SchemaTypes.String
    },
    permissions: [
        {
            type: SchemaTypes.ObjectId,
            rel: 'permission'
        }
    ]
}, {
    _id: true,
    timestamps: true,
    autoIndex: true,
    autoCreate: true
})
