import { ROLES } from "../../database/index";
import User from "../../database/models/User";
import type express from "express";

function checkDuplicateUsernameOrEmail(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (
    req.body.username == null ||
    req.body.email == null ||
    req.body.password == null
  ) {
    res.status(400).send({ message: "Missing a required parameter." });
    return;
  }

  // Username
  void User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user != null) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    // Email
    void User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user != null) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      }

      next();
    });
  });
}

function checkRolesExisted(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (req.body.roles != null) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i] as string)) {
        res.status(400).send({
          message:
            "Failed! Role does not exist = " + (req.body.roles[i] as string),
        });
        return;
      }
    }
  }

  next();
}

export const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
