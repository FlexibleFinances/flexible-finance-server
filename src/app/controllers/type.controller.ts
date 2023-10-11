import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import Type from "../../database/models/Type";
import { TypeResponseDto } from "../apiDtos/TypeDtos";
import { defaultLimit } from "../../utils/constants";
import type express from "express";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["TypeId"] })) {
    return;
  }

  const type = await Type.findOne({
    where: {
      id: req.params.TypeId,
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
    type: new TypeResponseDto(type),
  });
}

export async function createType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Type> = {
    name: req.body.name,
  };
  const type = await Type.create(createOptions);
  res
    .status(200)
    .send({ message: "Type created.", type: new TypeResponseDto(type) });
}

export async function updateType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(req, res, { params: ["TypeId"] }, { body: ["name"] })
  ) {
    return;
  }

  const type = await Type.findOne({
    where: {
      id: req.params.TypeId,
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
    type: new TypeResponseDto(type),
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
  const typeResponseDtos = types.map((type) => new TypeResponseDto(type));
  res.status(200).send({
    message: "Types gotten.",
    types: typeResponseDtos,
  });
}
