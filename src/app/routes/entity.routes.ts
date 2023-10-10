import * as controller from "../controllers/entity.controller";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setEntityRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/entity/:EntityId", [authJwt.verifyToken], controller.getEntity);

  app.post("/v1/entity", [authJwt.verifyToken], controller.createEntity);

  app.put(
    "/v1/entity/:EntityId",
    [authJwt.verifyToken],
    controller.updateEntity
  );

  app.get("/v1/entities", [authJwt.verifyToken], controller.getEntities);
}
