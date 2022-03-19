import {
  FieldDatum,
  FieldDatumCreationAttributes,
  FieldDatumUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getFieldDatum(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["fieldDatumId"] })) {
    return;
  }

  void FieldDatum.findOne({
    where: {
      id: req.params.fieldDatumId,
    },
  })
    .then((fieldDatum) => {
      if (fieldDatum === null) {
        res.status(500).send({
          message: "FieldDatum not found.",
        });
        return;
      }

      res.status(200).send({
        message: "FieldDatum gotten.",
        fieldDatum: fieldDatum,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createFieldDatum(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["fieldId"] })) {
    return;
  }

  const createOptions: FieldDatumCreationAttributes = {
    field: req.body.fieldId,
  };
  if (req.body.stringValue !== undefined) {
    createOptions.stringValue = req.body.stringValue;
  }
  if (req.body.intValue !== undefined) {
    createOptions.intValue = req.body.intValue;
  }
  if (req.body.dateValue !== undefined) {
    createOptions.dateValue = req.body.dateValue;
  }
  if (req.body.boolValue !== undefined) {
    createOptions.boolValue = req.body.boolValue;
  }
  if (req.body.accountId !== undefined) {
    createOptions.account = req.body.accountId;
  }
  if (req.body.entityId !== undefined) {
    createOptions.entity = req.body.entityId;
  }
  if (req.body.transactionId !== undefined) {
    createOptions.transaction = req.body.transactionId;
  }

  FieldDatum.create(createOptions)
    .then((newFieldDatum) => {
      res
        .status(200)
        .send({ message: "FieldDatum created.", fieldDatum: newFieldDatum });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateFieldDatum(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["fieldDatumId"] })) {
    return;
  }

  void FieldDatum.findOne({
    where: {
      id: req.params.fieldDatumId,
    },
  })
    .then((fieldDatum) => {
      if (fieldDatum === null) {
        res.status(500).send({
          message: "FieldDatum not found.",
        });
        return;
      }
      const updateOptions: FieldDatumUpdateAttributes = {};
      if (req.body.fieldId !== undefined) {
        updateOptions.field = req.body.fieldId;
      }
      if (req.body.stringValue !== undefined) {
        updateOptions.stringValue = req.body.stringValue;
      }
      if (req.body.intValue !== undefined) {
        updateOptions.intValue = req.body.intValue;
      }
      if (req.body.dateValue !== undefined) {
        updateOptions.dateValue = req.body.dateValue;
      }
      if (req.body.boolValue !== undefined) {
        updateOptions.boolValue = req.body.boolValue;
      }
      if (req.body.accountId !== undefined) {
        updateOptions.account = req.body.accountId;
      }
      if (req.body.entityId !== undefined) {
        updateOptions.entity = req.body.entityId;
      }
      if (req.body.transactionId !== undefined) {
        updateOptions.transaction = req.body.transactionId;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Field Datum attributes provided.",
        });
        return;
      }

      fieldDatum
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "FieldDatum updated.",
            fieldDatum: fieldDatum,
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

export function getFieldData(
  req: express.Request,
  res: express.Response
): void {
  const whereOptions: sequelize.WhereOptions = {};
  if (req.query.stringValue !== undefined) {
    whereOptions.stringValue = {
      [Op.iLike]: req.body.stringValue,
    };
  }
  if (req.query.intValueGT !== undefined) {
    whereOptions.intValue = {
      [Op.gte]: +req.body.intValueGT,
    };
  }
  if (req.query.intValueLT !== undefined) {
    whereOptions.intValue = {
      [Op.gte]: +req.body.intValueLT,
    };
  }
  if (req.query.dateValue !== undefined) {
    whereOptions.dateValue = {
      [Op.iLike]: req.body.dateValue,
    };
  }
  if (req.query.boolValue !== undefined) {
    whereOptions.boolValue = {
      [Op.is]: req.body.boolValue,
    };
  }
  if (req.query.fieldIds !== undefined) {
    whereOptions.field = {
      [Op.in]: (req.query.fieldIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.accountIds !== undefined) {
    whereOptions.account = {
      [Op.in]: (req.query.accountIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.entityIds !== undefined) {
    whereOptions.entity = {
      [Op.in]: (req.query.entityIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.transactionIds !== undefined) {
    whereOptions.transaction = {
      [Op.in]: (req.query.transactionIds as string[]).map((x) => {
        return +x;
      }),
    };
  }

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void FieldDatum.findAll(findOptions)
    .then((fieldData) => {
      res.status(200).send({
        message: "FieldData gotten.",
        fieldData: fieldData,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
