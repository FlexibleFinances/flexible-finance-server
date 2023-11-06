import * as controller from "../controllers/transactionTemplate.controller";
import {
  type TransactionTemplateRequest,
  type TransactionTemplateResponse,
  type TransactionTemplateSearchRequest,
  type TransactionTemplatesResponse,
} from "../apiDtos/TransactionTemplateDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setTransactionTemplateRoutes(app: express.Express): void {
  const endpointName = "transactions/templates";

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
      await controller.getTransactionTemplate(
        req as TransactionTemplateRequest,
        res as TransactionTemplateResponse
      );
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateTransactionTemplate(
        req as TransactionTemplateRequest,
        res as TransactionTemplateResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getTransactionTemplates(
        req as TransactionTemplateSearchRequest,
        res as TransactionTemplatesResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createTransactionTemplate(
        req as TransactionTemplateRequest,
        res as TransactionTemplateResponse
      );
    })
  );
}
