import * as controller from "../controllers/role.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setRoleRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api-v1/role/:roleId", [authJwt.verifyToken], controller.getRole);

  app.post(
    "/api-v1/role",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createRole
  );

  app.put(
    "/api-v1/role/:roleId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateRole
  );

  app.get("/api-v1/roles", [authJwt.verifyToken], controller.getRoles);
}
