import * as controller from "../controllers/type.controller";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setTypeRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/type/:TypeId", [authJwt.verifyToken], controller.getType);

  app.post("/v1/type", [authJwt.verifyToken], controller.createType);

  app.put("/v1/type/:TypeId", [authJwt.verifyToken], controller.updateType);

  app.get("/v1/types", [authJwt.verifyToken], controller.getTypes);
}
