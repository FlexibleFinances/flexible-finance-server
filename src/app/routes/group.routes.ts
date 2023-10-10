import * as controller from "../controllers/group.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setGroupRoutes(app: express.Express): void {
  const endpointName = "groups";

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
    asyncHandler(controller.getGroups)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createGroup)
  );

  app.get(
    "/v1/" + endpointName + "/:GroupId",
    [authJwt.verifyToken],
    asyncHandler(controller.getGroup)
  );

  app.put(
    "/v1/" + endpointName + "/:GroupId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateGroup)
  );
}
