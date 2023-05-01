import * as controller from "../controllers/fieldType.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setFieldTypeRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/v1/fieldType/:FieldTypeId",
    [authJwt.verifyToken],
    controller.getFieldType
  );

  app.post("/v1/fieldType", [authJwt.verifyToken], controller.createFieldType);

  app.put(
    "/v1/fieldType/:FieldTypeId",
    [authJwt.verifyToken],
    controller.updateFieldType
  );

  app.get("/v1/fieldTypes", [authJwt.verifyToken], controller.getFieldTypes);
}
