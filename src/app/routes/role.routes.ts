import * as controller from "../controllers/role.controller";
import {
  type RoleRequest,
  type RoleResponse,
  type RoleSearchRequest,
  type RolesResponse,
} from "../apiDtos/RoleDtos";
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
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getRoles(req as RoleSearchRequest, res as RolesResponse);
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken, authJwt.isAdmin],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createRole(req as RoleRequest, res as RoleResponse);
    })
  );

  app.get(
    "/v1/" + endpointName + "/:RoleId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getRole(req as RoleRequest, res as RoleResponse);
    })
  );

  app.put(
    "/v1/" + endpointName + "/:RoleId",
    [authJwt.verifyToken, authJwt.isAdmin],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateRole(req as RoleRequest, res as RoleResponse);
    })
  );
}
