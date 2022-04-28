import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import FieldType from "../../database/models/FieldType";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { fieldTypeTypeEnum } from "../utils/enumerators";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getFieldType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["FieldTypeId"] })) {
    return;
  }

  const fieldType = await FieldType.findOne({
    where: {
      id: req.params.FieldTypeId,
    },
  });
  if (fieldType === null) {
    res.status(500).send({
      message: "FieldType not found.",
    });
    return;
  }
  res.status(200).send({
    message: "FieldType gotten.",
    fieldType: fieldType,
  });
}

export async function createFieldType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<FieldType> = {
    name: req.body.name,
    type: req.body.type as fieldTypeTypeEnum,
    validator: req.body.validator,
  };
  const fieldType = await FieldType.create(createOptions);
  res.status(200).send({ message: "FieldType created.", fieldType: fieldType });
}

export async function updateFieldType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["FieldTypeId"] },
      { body: ["name"] }
    )
  ) {
    return;
  }

  const fieldType = await FieldType.findOne({
    where: {
      id: req.params.FieldTypeId,
    },
  });
  if (fieldType === null) {
    res.status(500).send({
      message: "FieldType not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<FieldType> = {
    name: req.body.name,
    type: req.body.type as fieldTypeTypeEnum,
    validator: req.body.validator,
  };
  console.log(updateOptions);
  await fieldType.update(updateOptions);
  res.status(200).send({
    message: "FieldType updated.",
    fieldType: fieldType,
  });
}

export async function getFieldTypes(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.FieldIds !== undefined) {
    whereOptions.fields = {
      [Op.in]: (req.query.FieldIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const fieldTypes = await FieldType.findAll(findOptions);
  res.status(200).send({
    message: "FieldTypes gotten.",
    fieldTypes: fieldTypes,
  });
}
