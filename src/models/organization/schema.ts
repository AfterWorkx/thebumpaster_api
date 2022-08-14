import {Schema, SchemaTypes} from "mongoose";
import {
    addMemberToOrganization,
    createOrganization,
    deleteOrganization,
    getOrganizationsList, removeMemberFromOrganization,
    setOrganizationProfile, updateMemberRoleInOrganization
} from "./helper";

export const OrganizationSchema = new Schema({
    name: {
        required: true,
        type: SchemaTypes.String
    },
    userId: {
        required: true,
        type: SchemaTypes.String,
    },
    type: SchemaTypes.String,
    profile: {
        type: SchemaTypes.ObjectId,
        ref: 'profile'
    },
    users: [
        {
            user: {
                type: SchemaTypes.ObjectId,
                ref: 'user'
            },
            role: {
                type: SchemaTypes.ObjectId,
                ref: 'role'
            }
        }
    ],
    documents: {
        type: SchemaTypes.ObjectId,
        ref: 'document'
    }

}, {
    _id: true,
    timestamps: true,
    autoIndex: true,
    autoCreate: true
})

OrganizationSchema.static("getOrganizationsList", getOrganizationsList)
OrganizationSchema.static("createOrganization", createOrganization)
OrganizationSchema.static("deleteOrganization", deleteOrganization)
OrganizationSchema.static("setOrganizationProfile", setOrganizationProfile)
OrganizationSchema.static("addMemberToOrganization", addMemberToOrganization)
OrganizationSchema.static("removeMemberFromOrganization", removeMemberFromOrganization)
OrganizationSchema.static("updateMemberRoleInOrganization", updateMemberRoleInOrganization)
