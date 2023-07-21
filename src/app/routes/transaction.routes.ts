import * as controller from "../controllers/transaction.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTransactionRoutes(app: express.Express): void {
  var endpointName = "transactions";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/v1/" + endpointName + "/:TransactionId",
    [authJwt.verifyToken],
    controller.getTransaction
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    controller.createTransaction
  );

  app.put(
    "/v1/" + endpointName + "/:TransactionId",
    [authJwt.verifyToken],
    controller.updateTransaction
  );

  app.get(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    controller.getTransactions
  );
}
