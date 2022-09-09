import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Group from "../../database/models/Group";
import { defaultLimit } from "../../utils/constants";
import express from "express";
import { hasRequestParameters } from "../../utils/helperFunctions";

export async function getGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["GroupId"] })) {
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
    group,
  });
}

export async function createGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Group> = {
    name: req.body.name,
  };
  const group = await Group.create(createOptions);
  res.status(200).send({
    message: "Group created.",
    group,
  });
}

export async function updateGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(req, res, { params: ["GroupId"] }, { body: ["name"] })
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
    group,
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
  res.status(200).send({
    message: "Groups gotten.",
    groups,
  });
}
