import * as controller from "../controllers/fieldDatum.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setFieldDatumRoutes(app: express.Express): void {
  const endpointName = "fieldData";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.getFieldData)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createFieldDatum)
  );

  app.get(
    "/v1/" + endpointName + "/:FieldDatumId",
    [authJwt.verifyToken],
    asyncHandler(controller.getFieldDatum)
  );

  app.put(
    "/v1/" + endpointName + "/:FieldDatumId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateFieldDatum)
  );
}
