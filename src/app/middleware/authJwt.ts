import User from "../../database/models/User";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

dotenv.config();

function verifyToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const token = req.headers["x-access-token"];

  if (token === undefined || token === null || typeof token !== "string") {
    res.status(403).send({
      message: "No token provided!",
    });
    return;
  }
  if (process.env.AUTH_SECRET === undefined) {
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

function isAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (req.body.tokenUserId === undefined) {
    res
      .status(500)
      .send({ message: "Did not decode access token into user ID." });
    return;
  }

  void User.findByPk(req.body.tokenUserId).then((user) => {
    user?.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!",
      });
    });
  });
}

function isSelf(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (req.body.tokenUserId === undefined) {
    res
      .status(500)
      .send({ message: "Did not decode access token into user ID." });
    return;
  }

  if (req.body.tokenUserId === req.params.userId) {
    next();
    return;
  }

  isAdmin(req, res, next);
}

export const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isSelf: isSelf,
};
