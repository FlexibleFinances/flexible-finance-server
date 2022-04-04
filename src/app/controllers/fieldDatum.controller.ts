import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import FieldDatum from "../../database/models/FieldDatum";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getFieldDatum(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["fieldDatumId"] })) {
    return;
  }

  const fieldDatum = await FieldDatum.findOne({
    where: {
      id: req.params.fieldDatumId,
    },
  });
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
}

export async function createFieldDatum(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { body: ["fieldId"] },
      { body: ["accountId", "entityId", "transactionId"] }
    )
  ) {
    return;
  }

  const createOptions: CreationAttributes<FieldDatum> = {
    FieldId: req.body.fieldId,
    stringValue: req.body.stringValue,
    intValue: req.body.intValue,
    dateValue: req.body.dateValue,
    boolValue: req.body.boolValue,
    AccountId: req.body.accountId,
    EntityId: req.body.entityId,
    TransactionId: req.body.transactionId,
  };
  const fieldDatum = await FieldDatum.create(createOptions);
  res
    .status(200)
    .send({ message: "FieldDatum created.", fieldDatum: fieldDatum });
}

export async function updateFieldDatum(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["fieldDatumId"] },
      {
        body: [
          "stringValue",
          "intValue",
          "dateValue",
          "boolValue",
          "accountId",
          "entityId",
          "transactionId",
        ],
      }
    )
  ) {
    return;
  }

  const fieldDatum = await FieldDatum.findOne({
    where: {
      id: req.params.fieldDatumId,
    },
  });
  if (fieldDatum === null) {
    res.status(500).send({
      message: "FieldDatum not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<FieldDatum> = {
    FieldId: req.body.fieldId,
    stringValue: req.body.stringValue,
    intValue: req.body.intValue,
    dateValue: req.body.dateValue,
    boolValue: req.body.boolValue,
    AccountId: req.body.accountId,
    EntityId: req.body.entityId,
    TransactionId: req.body.transactionId,
  };
  await fieldDatum.update(updateOptions);
  res.status(200).send({
    message: "FieldDatum updated.",
    fieldDatum: fieldDatum,
  });
}

export async function getFieldData(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
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
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const fieldData = await FieldDatum.findAll(findOptions);
  res.status(200).send({
    message: "FieldData gotten.",
    fieldData: fieldData,
  });
}
