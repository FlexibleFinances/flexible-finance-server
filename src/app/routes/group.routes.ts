import * as controller from "../controllers/group.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setGroupRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api-v1/group/:GroupId", [authJwt.verifyToken], controller.getGroup);

  app.post("/api-v1/group/", [authJwt.verifyToken], controller.createGroup);

  app.put(
    "/api-v1/group/:GroupId",
    [authJwt.verifyToken],
    controller.updateGroup
  );

  app.get("/api-v1/groups", [authJwt.verifyToken], controller.getGroups);
}
