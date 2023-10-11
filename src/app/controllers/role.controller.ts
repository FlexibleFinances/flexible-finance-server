import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import Role from "../../database/models/Role";
import { RoleResponseDto } from "../apiDtos/RoleDtos";
import { defaultLimit } from "../../utils/constants";
import type express from "express";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getRole(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["RoleId"] })) {
    return;
  }

  const role = await Role.findOne({
    where: {
      id: req.params.RoleId,
    },
  });
  if (role === null) {
    res.status(500).send({
      message: "Role not found.",
    });
    return;
  }
  res.status(200).send({
    message: "Role gotten.",
    role: new RoleResponseDto(role),
  });
}

export async function createRole(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Role> = {
    name: req.body.name,
  };
  const role = await Role.create(createOptions);
  res
    .status(200)
    .send({ message: "Role created.", role: new RoleResponseDto(role) });
}

export async function updateRole(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(req, res, { params: ["RoleId"] }, { body: ["name"] })
  ) {
    return;
  }

  const role = await Role.findOne({
    where: {
      id: req.params.RoleId,
    },
  });
  if (role === null) {
    res.status(500).send({
      message: "Role not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Role> = {
    name: req.body.name,
  };
  await role.update(updateOptions);
  res.status(200).send({
    message: "Role updated.",
    role: new RoleResponseDto(role),
  });
}

export async function getRoles(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.UserIds !== undefined) {
    whereOptions.users = {
      [Op.in]: (req.query.UserIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const roles = await Role.findAll(findOptions);
  const roleResponseDtos = roles.map((role) => new RoleResponseDto(role));
  res.status(200).send({
    message: "Roles gotten.",
    roles: roleResponseDtos,
  });
}
