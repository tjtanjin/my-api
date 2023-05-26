require('dotenv').config();
import https from "https";
import fs from "fs";
import express, { Express } from "express";
import bodyParser from "body-parser";
const app: Express = express();
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { parseSwaggerDocs } from "./utils";
const swaggerDocument = require("./swagger.json");

import { parseBool } from "./utils";

// load api docs
app.use("/api-docs", (req: any, rest: any, next: any) => {
    swaggerDocument["paths"] = parseSwaggerDocs();
    req.swaggerDoc = swaggerDocument;
    next();
}, swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// load counter module if enabled
if (parseBool(process.env.COUNTER_ENABLED)) {
    app.use(String(process.env.COUNTER_ENDPOINT), require("./routes/counter"));
    console.log("[Counter API] Counter Module loaded.");
}

// load shields module if enabled
if (parseBool(process.env.SHIELD_ENABLED)) {
    app.use(String(process.env.SHIELD_ENDPOINT), require("./routes/shields"));
    console.log("[Shields API] Shields Module loaded.");
}

// load app based on environment
if (process.env.NODE_ENV == "development") {
    app.listen(process.env.APP_PORT, () => {
	    console.log("API service [development] started on PORT " + process.env.APP_PORT);
    })
} else {
    https.createServer({
        key: fs.readFileSync(process.env.SSL_PRIVATE_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERTIFICATE as string),
    }, app)
    .listen(process.env.APP_PORT, () => {
        console.log("API service [production] started on PORT " + process.env.APP_PORT);
    });
}