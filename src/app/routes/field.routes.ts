import * as controller from "../controllers/field.controller";
import {
  type FieldRequest,
  type FieldResponse,
  type FieldSearchRequest,
  type FieldsResponse,
} from "../apiDtos/FieldDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setFieldRoutes(app: express.Express): void {
  const endpointName = "fields";

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
      await controller.getFields(
        req as FieldSearchRequest,
        res as FieldsResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createField(req as FieldRequest, res as FieldResponse);
    })
  );

  app.get(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getField(req as FieldRequest, res as FieldResponse);
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateField(req as FieldRequest, res as FieldResponse);
    })
  );
}
