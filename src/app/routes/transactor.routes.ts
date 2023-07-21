import * as controller from "../controllers/transactor.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTransactorRoutes(app: express.Express): void {
  var endpointName = "transactors";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/v1/" + endpointName + "/:TransactorId",
    [authJwt.verifyToken],
    controller.getTransactor
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    controller.createTransactor
  );

  app.put(
    "/v1/" + endpointName + "/:TransactorId",
    [authJwt.verifyToken],
    controller.updateTransactor
  );

  app.get("/v1/" + endpointName, [authJwt.verifyToken], controller.getTransactors);
}
