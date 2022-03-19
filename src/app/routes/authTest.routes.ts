import * as controller from "../controllers/authTest.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setAuthTestRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api-v1/test/all", controller.allAccess);

  app.get("/api-v1/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api-v1/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
}
