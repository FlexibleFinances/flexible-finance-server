import * as controller from "../controllers/field.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setFieldRoutes(app: express.Express): void {
  var endpointName = "fields";
  
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/v1/" + endpointName + "/:FieldId", [authJwt.verifyToken], controller.getField);

  app.post("/v1/" + endpointName, [authJwt.verifyToken], controller.createField);

  app.put("/v1/" + endpointName + "/:FieldId", [authJwt.verifyToken], controller.updateField);

  app.get("/v1/" + endpointName, [authJwt.verifyToken], controller.getFields);
}
