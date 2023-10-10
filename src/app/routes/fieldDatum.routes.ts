import * as controller from "../controllers/fieldDatum.controller";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

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
    "/v1/fieldDatum/:FieldDatumId",
    [authJwt.verifyToken],
    controller.getFieldDatum
  );

  app.post(
    "/v1/fieldDatum",
    [authJwt.verifyToken],
    controller.createFieldDatum
  );

  app.put(
    "/v1/fieldDatum/:FieldDatumId",
    [authJwt.verifyToken],
    controller.updateFieldDatum
  );

  app.get("/v1/fieldData", [authJwt.verifyToken], controller.getFieldData);
}
