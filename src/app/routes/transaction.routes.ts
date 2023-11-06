import * as controller from "../controllers/transaction.controller";
import {
  type TransactionRequest,
  type TransactionResponse,
  type TransactionSearchRequest,
  type TransactionsResponse,
} from "../apiDtos/TransactionDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setTransactionRoutes(app: express.Express): void {
  const endpointName = "transactions";

  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getTransaction(
        req as TransactionRequest,
        res as TransactionResponse
      );
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateTransaction(
        req as TransactionRequest,
        res as TransactionResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getTransactions(
        req as TransactionSearchRequest,
        res as TransactionsResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createTransaction(
        req as TransactionRequest,
        res as TransactionResponse
      );
    })
  );
}
