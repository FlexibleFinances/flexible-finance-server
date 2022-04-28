import * as controller from "../controllers/template.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTemplateRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api-v1/template/:TemplateId",
    [authJwt.verifyToken],
    controller.getTemplate
  );

  app.post(
    "/api-v1/template",
    [authJwt.verifyToken],
    controller.createTemplate
  );

  app.put(
    "/api-v1/template/:TemplateId",
    [authJwt.verifyToken],
    controller.updateTemplate
  );

  app.get("/api-v1/templates", [authJwt.verifyToken], controller.getTemplates);
}
