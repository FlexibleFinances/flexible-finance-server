import { type Identifier } from "sequelize/types";
import User from "../../database/models/User";
import dotenv from "dotenv";
import type express from "express";
import jwt from "jsonwebtoken";

dotenv.config();

function verifyToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  let token = req.headers.authorization;

  if (token == null || typeof token !== "string") {
    res.status(403).send({
      message: "No token provided!",
    });
    return;
  }
  const tokenParts = token.split(" ");
  if (tokenParts[0] !== "Bearer" || tokenParts.length !== 2) {
    res.status(403).send({
      message: "Authorization value is not a Bearer token.",
    });
    return;
  }
  token = tokenParts[1];

  if (process.env.AUTH_SECRET == null) {
    res.status(500).send("Authentication secret is unavailable.");
    return;
  }

  jwt.verify(
    token,
    process.env.AUTH_SECRET,
    (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err != null) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.body.tokenUserId = decoded.id;
      next();
    }
  );
}

async function isAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  if (req.body.tokenUserId == null) {
    res
      .status(500)
      .send({ message: "Did not decode access token into user ID." });
    return;
  }

  const user = await User.findByPk(req.body.tokenUserId as Identifier);
  if (user != null) {
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }
  }

  res.status(403).send({
    message: "Require Admin Role!",
  });
}

async function isSelf(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  if (req.body.tokenUserId == null) {
    res
      .status(500)
      .send({ message: "Did not decode access token into user ID." });
    return;
  }

  if (req.body.tokenUserId === req.params.UserId) {
    next();
    return;
  }

  await isAdmin(req, res, next);
}

export const authJwt = {
  verifyToken,
  isAdmin,
  isSelf,
};
