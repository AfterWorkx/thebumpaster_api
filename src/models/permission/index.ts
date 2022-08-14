import {model} from "mongoose";
import {PermissionSchema} from "./schema";
import {IPermissionModel, PermissionDocument} from "./interfaces";

const PermissionModel: IPermissionModel = model<PermissionDocument>("permission", PermissionSchema, "permissions") as IPermissionModel;

export default PermissionModel
