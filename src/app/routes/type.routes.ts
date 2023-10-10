import * as controller from "../controllers/type.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setTypeRoutes(app: express.Express): void {
  const endpointName = "types";

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
    asyncHandler(controller.getTypes)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createType)
  );

  app.get(
    "/v1/" + endpointName + "/:TypeId",
    [authJwt.verifyToken],
    asyncHandler(controller.getType)
  );

  app.put(
    "/v1/" + endpointName + "/:TypeId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateType)
  );
}
