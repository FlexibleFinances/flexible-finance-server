import * as controller from "../controllers/accountTemplate.controller";
import {
  type AccountTemplateRequest,
  type AccountTemplateResponse,
  type AccountTemplateSearchRequest,
  type AccountTemplatesResponse,
} from "../apiDtos/AccountTemplateDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setAccountTemplateRoutes(app: express.Express): void {
  const endpointName = "accounts/templates";

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
      await controller.getAccountTemplate(
        req as AccountTemplateRequest,
        res as AccountTemplateResponse
      );
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateAccountTemplate(
        req as AccountTemplateRequest,
        res as AccountTemplateResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getAccountTemplates(
        req as AccountTemplateSearchRequest,
        res as AccountTemplatesResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createAccountTemplate(
        req as AccountTemplateRequest,
        res as AccountTemplateResponse
      );
    })
  );
}
