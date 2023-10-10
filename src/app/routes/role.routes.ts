import * as controller from "../controllers/role.controller";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setRoleRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/role/:RoleId", [authJwt.verifyToken], controller.getRole);

  app.post(
    "/v1/role",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createRole
  );

  app.put(
    "/v1/role/:RoleId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateRole
  );

  app.get("/v1/roles", [authJwt.verifyToken], controller.getRoles);
}
