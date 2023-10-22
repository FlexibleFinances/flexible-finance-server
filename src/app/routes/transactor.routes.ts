import * as controller from "../controllers/transactor.controller";
import {
  type TransactorRequest,
  type TransactorResponse,
  type TransactorSearchRequest,
  type TransactorsResponse,
} from "../apiDtos/TransactorDtos";
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
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getTransactors(
        req as TransactorSearchRequest,
        res as TransactorsResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createTransactor(
        req as TransactorRequest,
        res as TransactorResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName + "/:TransactorId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getTransactor(
        req as TransactorRequest,
        res as TransactorResponse
      );
    })
  );

  app.put(
    "/v1/" + endpointName + "/:TransactorId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateTransactor(
        req as TransactorRequest,
        res as TransactorResponse
      );
    })
  );
}
