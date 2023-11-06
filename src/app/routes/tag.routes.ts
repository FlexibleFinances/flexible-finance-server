import * as controller from "../controllers/tag.controller";
import {
  type TagRequest,
  type TagResponse,
  type TagSearchRequest,
  type TagsResponse,
} from "../apiDtos/TagDtos";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setTagRoutes(app: express.Express): void {
  const endpointName = "tags";

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
      await controller.getTags(req as TagSearchRequest, res as TagsResponse);
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createTag(req as TagRequest, res as TagResponse);
    })
  );

  app.get(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getTag(req as TagRequest, res as TagResponse);
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateTag(req as TagRequest, res as TagResponse);
    })
  );
}
