import {authCheck, register, singIn} from "./controller";
import {AbstractRouter} from "../router";
import authorize from "../../middleware/authorize";

export class AuthRouter extends AbstractRouter {

    constructor() {
        super();

        AuthRouter.directory = __dirname;

        this._router.post("/auth", singIn)
        this._router.get("/auth", authorize, authCheck)

        this._router.post("/auth/register", register)
    }
}
