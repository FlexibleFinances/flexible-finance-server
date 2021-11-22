import * as controller from "../controllers/account.controller";
import { authJwt } from "../middleware/authJwt";
import express from "express";

export function setAccountRoutes(app: express.Express): void {
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

  app.get("/api/getAccounts", [authJwt.verifyToken], controller.getAccounts);

  app.post(
    "/api/createAccount",
    [authJwt.verifyToken],
    controller.createAccount
  );
}
