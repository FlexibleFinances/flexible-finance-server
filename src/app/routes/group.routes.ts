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

  app.get("/v1/group/:GroupId", [authJwt.verifyToken], controller.getGroup);

  app.post("/v1/group/", [authJwt.verifyToken], controller.createGroup);

  app.put("/v1/group/:GroupId", [authJwt.verifyToken], controller.updateGroup);

  app.get("/v1/groups", [authJwt.verifyToken], controller.getGroups);
}
