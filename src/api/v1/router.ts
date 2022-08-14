import {Router} from "express";
import {resolve} from "path";
import YAML from "yaml";
import {readFileSync} from "fs";

export class AbstractRouter {

    public static directory: string = __dirname;

    public static getOpenAPI() {
        let path = resolve(this.directory, './docs.yaml');

        path = path.replace('/dist/', '/src/');

        return YAML.parse(readFileSync(path, { encoding: "utf-8" }));
    }

    protected readonly _router: Router;

    constructor() {
        this._router = Router();
    }

    public getRouter(): Router {
        return this._router;
    }


}
