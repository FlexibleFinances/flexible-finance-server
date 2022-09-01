import * as controller from "../controllers/transactor.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTransactorRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api-v1/transactor/:TransactorId",
    [authJwt.verifyToken],
    controller.getTransactor
  );

  app.post(
    "/api-v1/transactor/",
    [authJwt.verifyToken],
    controller.createTransactor
  );

  app.put(
    "/api-v1/transactor/:TransactorId",
    [authJwt.verifyToken],
    controller.updateTransactor
  );

  app.get(
    "/api-v1/transactors",
    [authJwt.verifyToken],
    controller.getTransactors
  );
}
