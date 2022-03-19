import * as controller from "../controllers/account.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setAccountRoutes(app: express.Express): void {
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api-v1/account/:accountId",
    [authJwt.verifyToken],
    controller.getAccount
  );

  app.post("/api-v1/account/", [authJwt.verifyToken], controller.createAccount);

  app.put(
    "/api-v1/account/:accountId",
    [authJwt.verifyToken],
    controller.updateAccount
  );

  app.get("/api-v1/accounts", [authJwt.verifyToken], controller.getAccounts);
}
