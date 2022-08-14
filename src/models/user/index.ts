import {model} from "mongoose";
import {IUserModel, UserDocument} from "./interfaces";
import {UserSchema} from "./schema";

const UserModel: IUserModel = model<UserDocument>("user", UserSchema, "users") as IUserModel;

export default  UserModel
