import {
  User,
  UserCreationAttributes,
  UserUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getUser(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["userId"] })) {
    return;
  }

  void User.findOne({
    where: {
      id: req.params.userId,
    },
  })
    .then((user) => {
      if (user === null) {
        res.status(500).send({
          message: "User not found.",
        });
        return;
      }

      res.status(200).send({
        message: "User gotten.",
        user: user,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createUser(req: express.Request, res: express.Response): void {
  if (
    !hasRequestParameters(req, res, { body: ["username", "email", "password"] })
  ) {
    return;
  }

  const createOptions: UserCreationAttributes = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  if (req.body.roleIds !== undefined) {
    createOptions.roles = req.body.roleIds;
  }

  User.create(createOptions)
    .then((newUser) => {
      res.status(200).send({ message: "User created.", user: newUser });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateUser(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["userId"] })) {
    return;
  }

  void User.findOne({
    where: {
      id: req.params.userId,
    },
  })
    .then((user) => {
      if (user === null) {
        res.status(500).send({
          message: "User not found.",
        });
        return;
      }
      const updateOptions: UserUpdateAttributes = {};
      if (req.body.username !== undefined) {
        updateOptions.username = req.body.username;
      }
      if (req.body.email !== undefined) {
        updateOptions.email = req.body.email;
      }
      if (req.body.password !== undefined) {
        updateOptions.password = req.body.password;
      }
      if (req.body.roleIds !== undefined) {
        updateOptions.roles = req.body.roleIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No User attributes provided.",
        });
        return;
      }

      user
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "User updated.",
            user: user,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function getUsers(req: express.Request, res: express.Response): void {
  const whereOptions: sequelize.WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.email !== undefined) {
    whereOptions.email = {
      [Op.iLike]: req.body.email,
    };
  }
  if (req.query.roleIds !== undefined) {
    whereOptions.roles = {
      [Op.in]: (req.query.roleIds as string[]).map((x) => {
        return +x;
      }),
    };
  }

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void User.findAll(findOptions)
    .then((users) => {
      res.status(200).send({
        message: "Users gotten.",
        users: users,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
