import * as controller from "../controllers/fieldDatum.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setFieldDatumRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api-v1/fieldDatum/:fieldDatumId",
    [authJwt.verifyToken],
    controller.getFieldDatum
  );

  app.post(
    "/api-v1/fieldDatum",
    [authJwt.verifyToken],
    controller.createFieldDatum
  );

  app.put(
    "/api-v1/fieldDatum/:fieldDatumId",
    [authJwt.verifyToken],
    controller.updateFieldDatum
  );

  app.get("/api-v1/fieldData", [authJwt.verifyToken], controller.getFieldData);
}
