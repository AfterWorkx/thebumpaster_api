import {model} from "mongoose";
import {OrganizationSchema} from "./schema";
import {IOrganizationModel, OrganizationDocument} from "./interfaces";

const OrganizationModel: IOrganizationModel = model<OrganizationDocument>("organization", OrganizationSchema, "organizations") as IOrganizationModel;

export default OrganizationModel
