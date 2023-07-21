import * as controller from "../controllers/entity.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setEntityRoutes(app: express.Express): void {
  var endpointName = "entities";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/" + endpointName + "/:EntityId", [authJwt.verifyToken], controller.getEntity);

  app.post("/v1/"+ endpointName, [authJwt.verifyToken], controller.createEntity);

  app.put(
    "/v1/" + endpointName + "/:EntityId",
    [authJwt.verifyToken],
    controller.updateEntity
  );

  app.get("/v1/" + endpointName, [authJwt.verifyToken], controller.getEntities);
}
