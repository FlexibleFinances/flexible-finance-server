import * as controller from "../controllers/user.controller";
import {
  type UserRequest,
  type UserResponse,
  type UserSearchRequest,
  type UsersResponse,
} from "../apiDtos/UserDtos";
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
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getUsers(req as UserSearchRequest, res as UsersResponse);
    })
  );

  app.post(
    "/v1/" + endpointName,
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.createUser(req as UserRequest, res as UserResponse);
    })
  );

  app.get(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.getUser(req as UserRequest, res as UserResponse);
    })
  );

  app.put(
    "/v1/" + endpointName + "/:id",
    [authJwt.verifyToken, authJwt.isSelf],
    asyncHandler(async (req: express.Request, res: express.Response) => {
      await controller.updateUser(req as UserRequest, res as UserResponse);
    })
  );
}
