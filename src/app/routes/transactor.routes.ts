import * as controller from "../controllers/transactor.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setTransactorRoutes(app: express.Express): void {
  const endpointName = "transactors";

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
    asyncHandler(controller.getTransactors)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createTransactor)
  );

  app.get(
    "/v1/" + endpointName + "/:TransactorId",
    [authJwt.verifyToken],
    asyncHandler(controller.getTransactor)
  );

  app.put(
    "/v1/" + endpointName + "/:TransactorId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateTransactor)
  );
}
