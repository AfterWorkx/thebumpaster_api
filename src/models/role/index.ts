import {model} from "mongoose";
import {RoleSchema} from "./schema";
import {IRoleModel, RoleDocument} from "./interfaces";

const RoleModel: IRoleModel = model<RoleDocument>("role", RoleSchema, "roles") as IRoleModel;

export default RoleModel
