import * as controller from "../controllers/entity.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setEntityRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api-v1/entity/:entityId",
    [authJwt.verifyToken],
    controller.getEntity
  );

  app.post("/api-v1/entity", [authJwt.verifyToken], controller.createEntity);

  app.put(
    "/api-v1/entity/:entityId",
    [authJwt.verifyToken],
    controller.updateEntity
  );

  app.get("/api-v1/entities", [authJwt.verifyToken], controller.getEntities);
}
