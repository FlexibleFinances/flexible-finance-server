import * as controller from "../controllers/user.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setUserRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-User, Accept");
    next();
  });

  app.get("/api-v1/user/:UserId", [authJwt.verifyToken], controller.getUser);

  app.post("/api-v1/user", [authJwt.verifyToken], controller.createUser);

  app.put(
    "/api-v1/user/:UserId",
    [authJwt.verifyToken, authJwt.isSelf],
    controller.updateUser
  );

  app.get("/api-v1/users", [authJwt.verifyToken], controller.getUsers);
}
