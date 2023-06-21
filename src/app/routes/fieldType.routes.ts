import * as controller from "../controllers/fieldType.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setFieldTypeRoutes(app: express.Express): void {
  var endpointName = "fieldTypes";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/v1/" + endpointName + "/:FieldTypeId",
    [authJwt.verifyToken],
    controller.getFieldType
  );

  app.put(
    "/v1/" + endpointName + "/:FieldTypeId",
    [authJwt.verifyToken],
    controller.updateFieldType
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    controller.createFieldType
  );

  app.get(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    controller.getFieldTypes
  );
}
