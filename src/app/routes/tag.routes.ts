import * as controller from "../controllers/tag.controller";
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
    asyncHandler(controller.getTags)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createTag)
  );

  app.get(
    "/v1/" + endpointName + "/:TagId",
    [authJwt.verifyToken],
    asyncHandler(controller.getTag)
  );

  app.put(
    "/v1/" + endpointName + "/:TagId",
    [authJwt.verifyToken],
    asyncHandler(controller.updateTag)
  );
}
