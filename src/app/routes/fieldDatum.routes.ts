import * as controller from "../controllers/fieldDatum.controller";
import {
  type FieldDataResponse,
  type FieldDatumRequest,
  type FieldDatumResponse,
  type FieldDatumSearchRequest,
} from "../apiDtos/FieldDatumDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setFieldDatumRoutes(app: express.Express): void {
  const endpointName = "fieldData";

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
      await controller.getFieldData(
        req as FieldDatumSearchRequest,
        res as FieldDataResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createFieldDatum(
        req as FieldDatumRequest,
        res as FieldDatumResponse
      );
    })
  );

  app.get(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getFieldDatum(
        req as FieldDatumRequest,
        res as FieldDatumResponse
      );
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateFieldDatum(
        req as FieldDatumRequest,
        res as FieldDatumResponse
      );
    })
  );
}
