import * as controller from "../controllers/fieldType.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setFieldTypeRoutes(app: express.Express): void {
  const endpointName = "fieldTypes";

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
    asyncHandler(controller.getFieldTypes)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createFieldType)
  );

  app.get(
    "/v1/" + endpointName + "/:FieldTypeId",
    [authJwt.verifyToken],
    asyncHandler(controller.getFieldType)
  );

  app.put(
    "/v1/" + endpointName + "/:FieldTypeId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateFieldType)
  );
}
