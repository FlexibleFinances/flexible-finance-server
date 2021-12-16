import {
  Field,
  FieldCreationAttributes,
  FieldUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getField(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["fieldId"] })) {
    return;
  }

  void Field.findOne({
    where: {
      id: req.params.fieldId,
    },
  })
    .then((field) => {
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
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createField(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["name", "fieldTypeId"] })) {
    return;
  }

  const createOptions: FieldCreationAttributes = {
    name: req.body.name,
    fieldType: req.body.fieldTypeId,
  };
  if (req.body.datumIds !== undefined) {
    createOptions.data = req.body.datumIds;
  }
  if (req.body.templateIds !== undefined) {
    createOptions.templates = req.body.templateIds;
  }

  Field.create(createOptions)
    .then((newField) => {
      res.status(200).send({ message: "Field created.", field: newField });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateField(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["fieldId"] })) {
    return;
  }

  void Field.findOne({
    where: {
      id: req.params.fieldId,
    },
  })
    .then((field) => {
      if (field === null) {
        res.status(500).send({
          message: "Field not found.",
        });
        return;
      }
      const updateOptions: FieldUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.fieldTypeId !== undefined) {
        updateOptions.fieldType = req.body.fieldTypeId;
      }
      if (req.body.datumIds !== undefined) {
        updateOptions.data = req.body.datumIds;
      }
      if (req.body.templateIds !== undefined) {
        updateOptions.templates = req.body.templateIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Entity attributes provided.",
        });
        return;
      }

      field
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Field updated.",
            field: field,
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

export function getFields(req: express.Request, res: express.Response): void {
  const whereOptions: sequelize.WhereOptions = {};
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

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void Field.findAll(findOptions)
    .then((fields) => {
      res.status(200).send({
        message: "Fields gotten.",
        fields: fields,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
