import {model} from "mongoose";
import {IProfileModel, ProfileDocument} from "./interfaces";
import {ProfileSchema} from "./schema";

const ProfileModel: IProfileModel = model<ProfileDocument>("profile", ProfileSchema, "profiles") as IProfileModel;

export default  ProfileModel
