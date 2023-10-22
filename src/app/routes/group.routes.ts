import * as controller from "../controllers/group.controller";
import {
  type GroupRequest,
  type GroupResponse,
  type GroupSearchRequest,
  type GroupsResponse,
} from "../apiDtos/GroupDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setGroupRoutes(app: express.Express): void {
  const endpointName = "groups";

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
      await controller.getGroups(
        req as GroupSearchRequest,
        res as GroupsResponse
      );
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createGroup(req as GroupRequest, res as GroupResponse);
    })
  );

  app.get(
    "/v1/" + endpointName + "/:GroupId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getGroup(req as GroupRequest, res as GroupResponse);
    })
  );

  app.put(
    "/v1/" + endpointName + "/:GroupId",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateGroup(req as GroupRequest, res as GroupResponse);
    })
  );
}
