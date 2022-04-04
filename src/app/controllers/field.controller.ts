import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Field from "../../database/models/Field";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getField(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["fieldId"] })) {
    return;
  }

  const field = await Field.findOne({
    where: {
      id: req.params.fieldId,
    },
  });
  if (field === null) {
    res.status(500).send({
      message: "Field not found.",
    });
    return;
  }
  res.status(200).send({
    message: "Field gotten.",
    field: field,
  });
}

export async function createField(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name", "fieldTypeId"] })) {
    return;
  }

  const createOptions: CreationAttributes<Field> = {
    name: req.body.name,
    FieldTypeId: req.body.fieldTypeId,
  };
  const field = await Field.create(createOptions);
  res.status(200).send({ message: "Field created.", field: field });
}

export async function updateField(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["fieldId"] },
      { body: ["name", "fieldTypeId"] }
    )
  ) {
    return;
  }

  const field = await Field.findOne({
    where: {
      id: req.params.fieldId,
    },
  });
  if (field === null) {
    res.status(500).send({
      message: "Field not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Field> = {
    name: req.body.name,
    FieldTypeId: req.body.fieldTypeId,
  };
  await field.update(updateOptions);
  res.status(200).send({
    message: "Field updated.",
    field: field,
  });
}

export async function getFields(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.fieldTypeIds !== undefined) {
    whereOptions.fieldType = {
      [Op.in]: (req.query.fieldTypeIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.datumIds !== undefined) {
    whereOptions.data = {
      [Op.in]: (req.query.datumIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.templateIds !== undefined) {
    whereOptions.templates = {
      [Op.in]: (req.query.templateIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const fields = await Field.findAll(findOptions);
  res.status(200).send({
    message: "Fields gotten.",
    fields: fields,
  });
}
