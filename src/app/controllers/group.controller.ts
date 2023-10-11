import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import Group from "../../database/models/Group";
import { GroupResponseDto } from "../apiDtos/GroupDtos";
import { defaultLimit } from "../../utils/constants";
import type express from "express";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["GroupId"] })) {
    return;
  }

  const group = await Group.findOne({
    where: {
      id: req.params.GroupId,
    },
  });
  if (group === null) {
    res.status(500).send({
      message: "Group not found.",
    });
    return;
  }
  res.status(200).send({
    message: "Group gotten.",
    group: new GroupResponseDto(group),
  });
}

export async function createGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Group> = {
    name: req.body.name,
  };
  const group = await Group.create(createOptions);
  res.status(200).send({
    message: "Group created.",
    group: new GroupResponseDto(group),
  });
}

export async function updateGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(req, res, { params: ["GroupId"] }, { body: ["name"] })
  ) {
    return;
  }

  const group = await Group.findOne({
    where: {
      id: req.params.GroupId,
    },
  });
  if (group === null) {
    res.status(500).send({
      message: "Group not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Group> = {
    name: req.body.name,
  };
  await group.update(updateOptions);
  res.status(200).send({
    message: "Group updated.",
    group: new GroupResponseDto(group),
  });
}

export async function getGroups(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.AccountIds !== undefined) {
    whereOptions.account = {
      [Op.in]: (req.query.AccountIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.EntityIds !== undefined) {
    whereOptions.entity = {
      [Op.in]: (req.query.EntityIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const groups = await Group.findAll(findOptions);
  const groupResponseDtos = groups.map((group) => new GroupResponseDto(group));
  res.status(200).send({
    message: "Groups gotten.",
    groups: groupResponseDtos,
  });
}
