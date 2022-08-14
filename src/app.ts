import compression from 'compression';
import cors from 'cors';
import express, { json, urlencoded } from 'express'
import { hidePoweredBy, xssFilter } from 'helmet';
import { memory_limit } from './config/constants';
import Logger from './services/logger';
import i18n from "./config/localization";
import initializeMongooseClient from './services/database';
import { config } from 'dotenv';
import { APIRouter } from './api';
import { notFoundHandler, errorHandler } from './api/utility/response';

// Init env
config();

const port = process.env.PORT !== undefined ? Number(process.env.PORT) : 3000;
const logger = Logger("Express Application");

const app = express()

app.use(hidePoweredBy())
app.use(xssFilter())
app.use(cors());
app.use(json({limit: memory_limit}));
app.use(compression());
app.use(urlencoded({limit: memory_limit, extended: false}))
app.use(i18n.init)


const mountDocs = process.env.MOUNT_DOCS !== "false";

APIRouter.mountRoutes(app, "v1", mountDocs);

if (mountDocs) {
    APIRouter.mountSwaggerUI(app, ["v1"]);
}

app.use(notFoundHandler);
app.use(errorHandler);


app.listen(port, () => {
    logger.info(`App is up and running on port http://localhost:${port}`)

    initializeMongooseClient(process.env.NODE_ENV === "test")
        .then(() => {
            logger.info("Database connection is established successfully.")
        }, (error) => {
            logger.error("Failed initializing database connection.", error);
        });
})


