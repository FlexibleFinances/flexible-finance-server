import * as controller from "../controllers/type.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTypeRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api-v1/type/:typeId", [authJwt.verifyToken], controller.getType);

  app.post("/api-v1/type", [authJwt.verifyToken], controller.createType);

  app.put("/api-v1/type/:typeId", [authJwt.verifyToken], controller.updateType);

  app.get("/api-v1/types", [authJwt.verifyToken], controller.getTypes);
}
