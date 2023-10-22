import * as controller from "../controllers/account.controller";
import {
  type AccountRequest,
  type AccountResponse,
  type AccountSearchRequest,
  type AccountsResponse,
} from "../apiDtos/AccountDtos";
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
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getAccounts(
        req as AccountSearchRequest,
        res as AccountsResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createAccount(
        req as AccountRequest,
        res as AccountResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName + "/:AccountId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getAccount(
        req as AccountRequest,
        res as AccountResponse
      );
    })
  );

  app.put(
    "/v1/" + endpointName + "/:AccountId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateAccount(
        req as AccountRequest,
        res as AccountResponse
      );
    })
  );
}
