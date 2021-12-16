import * as controller from "../controllers/field.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setFieldRoutes(app: express.Express): void {
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

  app.get("/api-v1/field/:fieldId", [authJwt.verifyToken], controller.getField);

  app.post("/api-v1/field", [authJwt.verifyToken], controller.createField);

  app.put(
    "/api-v1/field/:fieldId",
    [authJwt.verifyToken],
    controller.updateField
  );

  app.get("/api-v1/fields", [authJwt.verifyToken], controller.getFields);
}
