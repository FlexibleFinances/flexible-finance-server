import * as controller from "../controllers/entity.controller";
import {
  type EntitiesResponse,
  type EntityRequest,
  type EntityResponse,
  type EntitySearchRequest,
} from "../apiDtos/EntityDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setEntityRoutes(app: express.Express): void {
  const endpointName = "entities";

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
      await controller.getEntities(
        req as EntitySearchRequest,
        res as EntitiesResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createEntity(
        req as EntityRequest,
        res as EntityResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getEntity(req as EntityRequest, res as EntityResponse);
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateEntity(
        req as EntityRequest,
        res as EntityResponse
      );
    })
  );
}
