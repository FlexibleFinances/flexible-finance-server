import * as controller from "../controllers/status.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setStatusRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api-v1/status/:StatusId",
    [authJwt.verifyToken],
    controller.getStatus
  );

  app.post("/api-v1/status", [authJwt.verifyToken], controller.createStatus);

  app.put(
    "/api-v1/status/:StatusId",
    [authJwt.verifyToken],
    controller.updateStatus
  );

  app.get("/api-v1/statuses", [authJwt.verifyToken], controller.getStatuses);
}
