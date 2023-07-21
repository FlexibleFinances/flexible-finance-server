import * as controller from "../controllers/transaction.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTransactionRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/v1/transaction/:TransactionId",
    [authJwt.verifyToken],
    controller.getTransaction
  );

  app.post(
    "/v1/transaction",
    [authJwt.verifyToken],
    controller.createTransaction
  );

  app.put(
    "/v1/transaction/:TransactionId",
    [authJwt.verifyToken],
    controller.updateTransaction
  );

  app.get(
    "/v1/transactions",
    [authJwt.verifyToken],
    controller.getTransactions
  );
}
