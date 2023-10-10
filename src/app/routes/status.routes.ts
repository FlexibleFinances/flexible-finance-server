import * as controller from "../controllers/status.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setStatusRoutes(app: express.Express): void {
  const endpointName = "statuses";

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
    asyncHandler(controller.getStatuses)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createStatus)
  );

  app.get(
    "/v1/" + endpointName + "/:StatusId",
    [authJwt.verifyToken],
    asyncHandler(controller.getStatus)
  );

  app.put(
    "/v1/" + endpointName + "/:StatusId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateStatus)
  );
}
