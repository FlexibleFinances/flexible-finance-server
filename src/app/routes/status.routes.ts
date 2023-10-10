import * as controller from "../controllers/status.controller";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setStatusRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/status/:StatusId", [authJwt.verifyToken], controller.getStatus);

  app.post("/v1/status", [authJwt.verifyToken], controller.createStatus);

  app.put(
    "/v1/status/:StatusId",
    [authJwt.verifyToken],
    controller.updateStatus
  );

  app.get("/v1/statuses", [authJwt.verifyToken], controller.getStatuses);
}
