import * as controller from "../controllers/user.controller";
import asyncHandler from "express-async-handler";
import { authJwt } from "../middleware/authJwt";
import type express from "express";

export function setUserRoutes(app: express.Express): void {
  const endpointName = "users";

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
    asyncHandler(controller.getUsers)
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(controller.createUser)
  );

  app.get(
    "/v1/" + endpointName + "/:UserId",
    [authJwt.verifyToken],
    asyncHandler(controller.getUser)
  );

  app.put(
    "/v1/" + endpointName + "/:UserId",
    [authJwt.verifyToken, authJwt.isSelf],
    asyncHandler(controller.updateUser)
  );
}
