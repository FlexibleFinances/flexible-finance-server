import User from "../../database/models/User";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

dotenv.config();

function verifyToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): any {
  const token = req.headers["x-access-token"];

  if (token !== undefined && token !== null && typeof token === "string") {
    let authSecret = "";
    if (process.env.AUTH_SECRET !== undefined) {
      authSecret = process.env.AUTH_SECRET;
    }
    jwt.verify(
      token,
      authSecret,
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err != null) {
          return res.status(401).send({
            message: "Unauthorized!",
          });
        }
        req.body.userId = decoded.id;
        next();
      }
    );
  } else {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
}

function isAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  void User.findByPk(req.body.userId).then((user) => {
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

export const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
