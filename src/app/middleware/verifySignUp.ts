import sequelize, { ROLES } from "../../database/index";
import express from "express";

function checkDuplicateUsernameOrEmail(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (
    req.body.username === undefined ||
    req.body.email === undefined ||
    req.body.password === undefined
  ) {
    res.status(400).send({ message: "Missing a required parameter." });
    return;
  }

  // Username
  void sequelize.models.User.findOne({
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
    void sequelize.models.User.findOne({
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
  if (req.body.roles !== undefined && req.body.roles !== null) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
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
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};
