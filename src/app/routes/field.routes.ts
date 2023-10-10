import * as controller from "../controllers/field.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setFieldRoutes(app: express.Express): void {
  const endpointName = "fields";

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
    asyncHandler(controller.getFields)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createField)
  );

  app.get(
    "/v1/" + endpointName + "/:FieldId",
    [authJwt.verifyToken],
    asyncHandler(controller.getField)
  );

  app.put(
    "/v1/" + endpointName + "/:FieldId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateField)
  );
}
