import * as controller from "../controllers/fieldDatum.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setFieldDatumRoutes(app: express.Express): void {
  var endpointName = "fieldData";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/v1/" + endpointName + "/:FieldDatumId",
    [authJwt.verifyToken],
    controller.getFieldDatum
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    controller.createFieldDatum
  );

  app.put(
    "/v1/" + endpointName + "/:FieldDatumId",
    [authJwt.verifyToken],
    controller.updateFieldDatum
  );

  app.get("/v1/" + endpointName, [authJwt.verifyToken], controller.getFieldData);
}
