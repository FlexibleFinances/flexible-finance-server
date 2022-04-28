import * as controller from "../controllers/accountGroup.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setAccountGroupRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api-v1/accountGroup/:AccountGroupId",
    [authJwt.verifyToken],
    controller.getAccountGroup
  );

  app.post(
    "/api-v1/accountGroup/",
    [authJwt.verifyToken],
    controller.createAccountGroup
  );

  app.put(
    "/api-v1/accountGroup/:AccountGroupId",
    [authJwt.verifyToken],
    controller.updateAccountGroup
  );

  app.get(
    "/api-v1/accountGroups",
    [authJwt.verifyToken],
    controller.getAccountGroups
  );
}
