import {Schema, SchemaTypes} from "mongoose";
import {createProfile, deleteProfileById, getProfileById, getProfileByUserId} from "./helper";

export const ProfileSchema = new Schema({
    userId: {
        required: true,
        type: SchemaTypes.String,
    },
    firstName: SchemaTypes.String,
    lastName: SchemaTypes.String,
    website: SchemaTypes.String,
    phone: SchemaTypes.String,
    biography: SchemaTypes.String,
    avatar: SchemaTypes.String,
}, {
    autoIndex: true,
    timestamps: true,
    _id: true,
});

ProfileSchema.static("getProfileByUserId", getProfileByUserId)
ProfileSchema.static("getProfileById", getProfileById)
ProfileSchema.static("createProfile", createProfile)
ProfileSchema.static("deleteProfileById", deleteProfileById)
