import * as controller from "../controllers/user.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setUserRoutes(app: express.Express): void {
  var endpointName = "users";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-User, Accept");
    next();
  });

  app.get("/v1/" + endpointName + "/:UserId", [authJwt.verifyToken], controller.getUser);

  app.post("/v1/" + endpointName, [authJwt.verifyToken], controller.createUser);

  app.put(
    "/v1/" + endpointName + "/:UserId",
    [authJwt.verifyToken, authJwt.isSelf],
    controller.updateUser
  );

  app.get("/v1/" + endpointName, [authJwt.verifyToken], controller.getUsers);
}
