import * as controller from "../controllers/template.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTemplateRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/getTemplates", [authJwt.verifyToken], controller.getTemplates);

  app.post(
    "/api/createTemplate",
    [authJwt.verifyToken],
    controller.createTemplate
  );
}
