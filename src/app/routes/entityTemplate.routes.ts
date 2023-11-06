import * as controller from "../controllers/entityTemplate.controller";
import {
  type EntityTemplateRequest,
  type EntityTemplateResponse,
  type EntityTemplateSearchRequest,
  type EntityTemplatesResponse,
} from "../apiDtos/EntityTemplateDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setEntityTemplateRoutes(app: express.Express): void {
  const endpointName = "entities/templates";

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
      await controller.getEntityTemplates(
        req as EntityTemplateSearchRequest,
        res as EntityTemplatesResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createEntityTemplate(
        req as EntityTemplateRequest,
        res as EntityTemplateResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getEntityTemplate(
        req as EntityTemplateRequest,
        res as EntityTemplateResponse
      );
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateEntityTemplate(
        req as EntityTemplateRequest,
        res as EntityTemplateResponse
      );
    })
  );
}
