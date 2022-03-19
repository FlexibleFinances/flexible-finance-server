import {
  FieldType,
  FieldTypeCreationAttributes,
  FieldTypeUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getFieldType(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["fieldTypeId"] })) {
    return;
  }

  void FieldType.findOne({
    where: {
      id: req.params.fieldTypeId,
    },
  })
    .then((fieldType) => {
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
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createFieldType(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["name"] })) {
    return;
  }

  const createOptions: FieldTypeCreationAttributes = {
    name: req.body.name,
  };
  if (req.body.fieldIds !== undefined) {
    createOptions.fields = req.body.fieldIds;
  }

  FieldType.create(createOptions)
    .then((newFieldType) => {
      res
        .status(200)
        .send({ message: "FieldType created.", fieldType: newFieldType });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateFieldType(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["fieldTypeId"] })) {
    return;
  }

  void FieldType.findOne({
    where: {
      id: req.params.fieldTypeId,
    },
  })
    .then((fieldType) => {
      if (fieldType === null) {
        res.status(500).send({
          message: "FieldType not found.",
        });
        return;
      }
      const updateOptions: FieldTypeUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.fieldIds !== undefined) {
        updateOptions.fields = req.body.fieldIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Field Type attributes provided.",
        });
        return;
      }

      fieldType
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "FieldType updated.",
            fieldType: fieldType,
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

export function getFieldTypes(
  req: express.Request,
  res: express.Response
): void {
  const whereOptions: sequelize.WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.fieldIds !== undefined) {
    whereOptions.fields = {
      [Op.in]: (req.query.fieldIds as string[]).map((x) => {
        return +x;
      }),
    };
  }

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void FieldType.findAll(findOptions)
    .then((fieldTypes) => {
      res.status(200).send({
        message: "FieldTypes gotten.",
        fieldTypes: fieldTypes,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
