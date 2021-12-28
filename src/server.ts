import * as OpenApiValidator from "express-openapi-validator";
import * as models from "./database/models/index";
import * as swaggerUi from "swagger-ui-express";
import * as yaml from "js-yaml";
import { migrator, runMigrations } from "./database/index";
import compression from "compression";
import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import setAllRoutes from "./app/routes/index";
import toobusy from "toobusy-js";

const app = express();

const apiDoc = yaml.load(
  fs.readFileSync("build/openapi.yml").toString()
) as swaggerUi.JsonObject;

const validatorOptions = {
  apiSpec: "./build/openapi.yml",
  validateRequests: true,
  validateResponses: true,
  validateApiSpec: true,
  ignoreUndocumented: true,
};

app
  .use(express.static(path.join(__dirname, "/public")))
  .use(helmet())
  .use(compression())
  .use(cors())
  .use(hpp())
  .use(express.json({ limit: "1kb" }))
  .use(express.urlencoded({ extended: true, limit: "1kb" }))
  .use(OpenApiValidator.middleware(validatorOptions))
  .use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.log(err);
      res.status(err.status ?? 500).json({
        error: {
          message: err.message,
          errors: err.errors,
        },
      });
    }
  )
  .use("/api-v1/api-docs", swaggerUi.serve, swaggerUi.setup(apiDoc))
  .set("views", path.join(__dirname, "/views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"));

app.use(function (req, res, next) {
  if (toobusy()) {
    // log if you see necessary
    res.status(503).send("Server Too Busy");
  } else {
    next();
  }
});

setAllRoutes(app);

runMigrations(migrator)
  .then(() => {
    void models.syncAllModels();
  })
  .catch((err: any) => {
    console.log(err);
  });

export default app;
