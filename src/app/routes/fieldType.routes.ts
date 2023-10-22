import * as controller from "../controllers/fieldType.controller";
import {
  type FieldTypeRequest,
  type FieldTypeResponse,
  type FieldTypeSearchRequest,
  type FieldTypesResponse,
} from "../apiDtos/FieldTypeDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setFieldTypeRoutes(app: express.Express): void {
  const endpointName = "fieldTypes";

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
      await controller.getFieldTypes(
        req as FieldTypeSearchRequest,
        res as FieldTypesResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createFieldType(
        req as FieldTypeRequest,
        res as FieldTypeResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName + "/:FieldTypeId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getFieldType(
        req as FieldTypeRequest,
        res as FieldTypeResponse
      );
    })
  );

  app.put(
    "/v1/" + endpointName + "/:FieldTypeId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateFieldType(
        req as FieldTypeRequest,
        res as FieldTypeResponse
      );
    })
  );
}
