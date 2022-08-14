import {Schema, SchemaTypes} from "mongoose";
import {
    addToken,
    createUser,
    deleteUserByEmail,
    deleteUserById,
    getUserByEmail,
    getUserById, removeToken,
    updateToken
} from "./helper";

export const UserSchema = new Schema({
    email: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    password: {
        type: SchemaTypes.String,
        required: true,
        minlength: 9,
    },
    tokens: {
        type: SchemaTypes.Array,
        items: {
            name: SchemaTypes.String,
            value: SchemaTypes.String,
            createdAt: SchemaTypes.Date,
        },
        default: []
    },
    profile: {
        type: SchemaTypes.ObjectId,
        ref: "profile"
    },
}, {
    autoIndex: true,
    timestamps: true,
    _id: true,
});

UserSchema.static("getUserById", getUserById)
UserSchema.static("getUserByEmail", getUserByEmail)

UserSchema.static("createUser", createUser)

UserSchema.static("addToken", addToken)
UserSchema.static("updateToken", updateToken)
UserSchema.static("removeToken", removeToken)

UserSchema.static("deleteUserByEmail", deleteUserByEmail)
UserSchema.static("deleteUserById", deleteUserById)
