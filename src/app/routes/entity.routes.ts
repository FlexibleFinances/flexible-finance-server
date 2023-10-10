import * as controller from "../controllers/entity.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setEntityRoutes(app: express.Express): void {
  const endpointName = "entities";

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
    asyncHandler(controller.getEntities)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createEntity)
  );

  app.get(
    "/v1/" + endpointName + "/:EntityId",
    [authJwt.verifyToken],
    asyncHandler(controller.getEntity)
  );

  app.put(
    "/v1/" + endpointName + "/:EntityId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateEntity)
  );
}
