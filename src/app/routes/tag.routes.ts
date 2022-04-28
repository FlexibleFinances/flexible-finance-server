import * as controller from "../controllers/tag.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTagRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api-v1/tag/:TagId", [authJwt.verifyToken], controller.getTag);

  app.post("/api-v1/tag", [authJwt.verifyToken], controller.createTag);

  app.put("/api-v1/tag/:TagId", [authJwt.verifyToken], controller.updateTag);

  app.get("/api-v1/tags", [authJwt.verifyToken], controller.getTags);
}
