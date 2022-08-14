import {getServerLiveness, getServerReadiness} from "./controller";
import {AbstractRouter} from "../router";

export class HealthRouter extends AbstractRouter {

    constructor() {
        super();

        HealthRouter.directory = __dirname;

        this._router.get("/health/liveness", getServerLiveness);

        this._router.get("/health/readiness", getServerReadiness);

    }
}
