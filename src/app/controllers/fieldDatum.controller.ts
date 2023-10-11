import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import FieldDatum from "../../database/models/FieldDatum";
import { FieldDatumResponseDto } from "../apiDtos/FieldDatumDtos";
import { defaultLimit } from "../../utils/constants";
import type express from "express";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getFieldDatum(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["FieldDatumId"] })) {
    return;
  }

  const fieldDatum = await FieldDatum.findOne({
    where: {
      id: req.params.FieldDatumId,
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
    fieldDatum: new FieldDatumResponseDto(fieldDatum),
  });
}

export async function createFieldDatum(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(
      req,
      res,
      { body: ["FieldId"] },
      { body: ["AccountId", "EntityId", "TransactionId"] }
    )
  ) {
    return;
  }

  const createOptions: CreationAttributes<FieldDatum> = {
    FieldId: req.body.FieldId,
    stringValue: req.body.stringValue,
    intValue: req.body.intValue,
    dateValue: req.body.dateValue,
    boolValue: req.body.boolValue,
    AccountId: req.body.AccountId,
    EntityId: req.body.EntityId,
    TransactionId: req.body.TransactionId,
  };
  const fieldDatum = await FieldDatum.create(createOptions);
  res.status(200).send({
    message: "FieldDatum created.",
    fieldDatum: new FieldDatumResponseDto(fieldDatum),
  });
}

export async function updateFieldDatum(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(
      req,
      res,
      { params: ["FieldDatumId"] },
      {
        body: [
          "stringValue",
          "intValue",
          "dateValue",
          "boolValue",
          "AccountId",
          "EntityId",
          "TransactionId",
        ],
      }
    )
  ) {
    return;
  }

  const fieldDatum = await FieldDatum.findOne({
    where: {
      id: req.params.FieldDatumId,
    },
  });
  if (fieldDatum === null) {
    res.status(500).send({
      message: "FieldDatum not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<FieldDatum> = {
    FieldId: req.body.FieldId,
    stringValue: req.body.stringValue,
    intValue: req.body.intValue,
    dateValue: req.body.dateValue,
    boolValue: req.body.boolValue,
    AccountId: req.body.AccountId,
    EntityId: req.body.EntityId,
    TransactionId: req.body.TransactionId,
  };
  await fieldDatum.update(updateOptions);
  res.status(200).send({
    message: "FieldDatum updated.",
    fieldDatum: new FieldDatumResponseDto(fieldDatum),
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
  if (req.query.FieldIds !== undefined) {
    whereOptions.field = {
      [Op.in]: (req.query.FieldIds as string[]).map((x) => {
        return +x;
      }),
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
  if (req.query.TransactionIds !== undefined) {
    whereOptions.transaction = {
      [Op.in]: (req.query.TransactionIds as string[]).map((x) => {
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
  const fieldDatumResponseDtos = fieldData.map(
    (fieldDatum) => new FieldDatumResponseDto(fieldDatum)
  );
  res.status(200).send({
    message: "FieldData gotten.",
    fieldData: fieldDatumResponseDtos,
  });
}
