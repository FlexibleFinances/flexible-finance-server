import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import User from "../../database/models/User";
import { defaultLimit } from "../../utils/constants";
import type express from "express";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getUser(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["UserId"] })) {
    return;
  }

  const user = await User.findOne({
    where: {
      id: req.params.UserId,
    },
  });
  if (user === null) {
    res.status(500).send({
      message: "User not found.",
    });
    return;
  }
  res.status(200).send({
    message: "User gotten.",
    user,
  });
}

export async function createUser(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(req, res, { body: ["username", "email", "password"] })
  ) {
    return;
  }

  const createOptions: CreationAttributes<User> = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  const user = await User.create(createOptions);
  res.status(200).send({ message: "User created.", user });
}

export async function updateUser(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(
      req,
      res,
      { params: ["UserId"] },
      { body: ["username", "email", "password"] }
    )
  ) {
    return;
  }

  const user = await User.findOne({
    where: {
      id: req.params.UserId,
    },
  });
  if (user === null) {
    res.status(500).send({
      message: "User not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<User> = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  await user.update(updateOptions);
  res.status(200).send({
    message: "User updated.",
    user,
  });
}

export async function getUsers(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
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
  if (req.query.RoleIds !== undefined) {
    whereOptions.roles = {
      [Op.in]: (req.query.RoleIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const users = await User.findAll(findOptions);
  res.status(200).send({
    message: "Users gotten.",
    users,
  });
}
