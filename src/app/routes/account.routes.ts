import * as controller from "../controllers/account.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setAccountRoutes(app: express.Express): void {
  const endpointName = "accounts";

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
    asyncHandler(controller.getAccounts)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createAccount)
  );

  app.get(
    "/v1/" + endpointName + "/:AccountId",
    [authJwt.verifyToken],
    asyncHandler(controller.getAccount)
  );

  app.put(
    "/v1/" + endpointName + "/:AccountId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateAccount)
  );
}
