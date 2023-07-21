import * as controller from "../controllers/role.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setRoleRoutes(app: express.Express): void {
  var endpointName = "roles";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/" + endpointName + "/:RoleId", [authJwt.verifyToken], controller.getRole);

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createRole
  );

  app.put(
    "/v1/" + endpointName + "/:RoleId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateRole
  );

  app.get("/v1/" + endpointName, [authJwt.verifyToken], controller.getRoles);
}
