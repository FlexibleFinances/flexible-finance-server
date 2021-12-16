import * as controller from "../controllers/transaction.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setTransactionRoutes(app: express.Express): void {
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

  app.get(
    "/api-v1/transaction/:transactionId",
    [authJwt.verifyToken],
    controller.getTransaction
  );

  app.post(
    "/api-v1/transaction",
    [authJwt.verifyToken],
    controller.createTransaction
  );

  app.put(
    "/api-v1/transaction/:transactionId",
    [authJwt.verifyToken],
    controller.updateTransaction
  );

  app.get(
    "/api-v1/transactions",
    [authJwt.verifyToken],
    controller.getTransactions
  );
}
