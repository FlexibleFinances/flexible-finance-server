import * as controller from "../controllers/transaction.controller";
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
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.getTransactions)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createTransaction)
  );

  app.get(
    "/v1/" + endpointName + "/:TransactionId",
    [authJwt.verifyToken],
    asyncHandler(controller.getTransaction)
  );

  app.put(
    "/v1/" + endpointName + "/:TransactionId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateTransaction)
  );
}
