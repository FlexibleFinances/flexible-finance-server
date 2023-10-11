import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import FieldType from "../../database/models/FieldType";
import { FieldTypeResponseDto } from "../apiDtos/FieldTypeDtos";
import { defaultLimit } from "../../utils/constants";
import type express from "express";
import { type fieldTypeTypeEnum } from "../../utils/enumerators";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getFieldType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["FieldTypeId"] })) {
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
    fieldType: new FieldTypeResponseDto(fieldType),
  });
}

export async function createFieldType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<FieldType> = {
    name: req.body.name,
    type: req.body.type as fieldTypeTypeEnum,
    validator: req.body.validator,
  };
  const fieldType = await FieldType.create(createOptions);
  res.status(200).send({
    message: "FieldType created.",
    fieldType: new FieldTypeResponseDto(fieldType),
  });
}

export async function updateFieldType(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(
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
    fieldType: new FieldTypeResponseDto(fieldType),
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
  const fieldTypeResponseDtos = fieldTypes.map(
    (fieldType) => new FieldTypeResponseDto(fieldType)
  );
  res.status(200).send({
    message: "FieldTypes gotten.",
    fieldTypes: fieldTypeResponseDtos,
  });
}
