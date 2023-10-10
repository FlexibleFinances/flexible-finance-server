import * as controller from "../controllers/field.controller";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setFieldRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/field/:FieldId", [authJwt.verifyToken], controller.getField);

  app.post("/v1/field", [authJwt.verifyToken], controller.createField);

  app.put("/v1/field/:FieldId", [authJwt.verifyToken], controller.updateField);

  app.get("/v1/fields", [authJwt.verifyToken], controller.getFields);
}
