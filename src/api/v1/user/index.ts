import {createUser, getUserData, queryUsers, updateUserData} from "./controller";
import {AbstractRouter} from "../router";
import authorize from "../../middleware/authorize";

export class UserRouter extends AbstractRouter {


    constructor() {
        super();

        UserRouter.directory = __dirname;

        this._router.get("/users", authorize, queryUsers)

        this._router.post("/users", authorize, createUser)

        this._router.get("/users/:id", authorize, getUserData)

        this._router.post("/users/:id", authorize, updateUserData)

    }
}
