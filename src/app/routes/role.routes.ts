import * as controller from "../controllers/role.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setRoleRoutes(app: express.Express): void {
  const endpointName = "roles";

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
    asyncHandler(controller.getRoles)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken, authJwt.isAdmin],
    asyncHandler(controller.createRole)
  );

  app.get(
    "/v1/" + endpointName + "/:RoleId",
    [authJwt.verifyToken],
    asyncHandler(controller.getRole)
  );

  app.put(
    "/v1/" + endpointName + "/:RoleId",
    [authJwt.verifyToken, authJwt.isAdmin],
    asyncHandler(controller.updateRole)
  );
}
