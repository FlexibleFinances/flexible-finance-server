import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Type from "../../database/models/Type";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["typeId"] })) {
    return;
  }

  const type = await Type.findOne({
    where: {
      id: req.params.typeId,
    },
  });
  if (type === null) {
    res.status(500).send({
      message: "Type not found.",
    });
    return;
  }
  res.status(200).send({
    message: "Type gotten.",
    type: type,
  });
}

export async function createType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Type> = {
    name: req.body.name,
  };
  const type = await Type.create(createOptions);
  res.status(200).send({ message: "Type created.", type: type });
}

export async function updateType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(req, res, { params: ["typeId"] }, { body: ["name"] })
  ) {
    return;
  }

  const type = await Type.findOne({
    where: {
      id: req.params.typeId,
    },
  });
  if (type === null) {
    res.status(500).send({
      message: "Type not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Type> = {
    name: req.body.name,
  };
  await type.update(updateOptions);
  res.status(200).send({
    message: "Type updated.",
    type: type,
  });
}

export async function getTypes(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const types = await Type.findAll(findOptions);
  res.status(200).send({
    message: "Types gotten.",
    types: types,
  });
}
