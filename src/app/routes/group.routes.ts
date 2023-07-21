import * as controller from "../controllers/group.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setGroupRoutes(app: express.Express): void {
  var endpointName = "groups";


  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/"+ endpointName + "/:GroupId", [authJwt.verifyToken], controller.getGroup);

  app.post("/v1/" + endpointName, [authJwt.verifyToken], controller.createGroup);

  app.put("/v1/"+ endpointName + "/:GroupId", [authJwt.verifyToken], controller.updateGroup);

  app.get("/v1/" + endpointName, [authJwt.verifyToken], controller.getGroups);
}
