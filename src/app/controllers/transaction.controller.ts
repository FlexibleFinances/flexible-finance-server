import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import FieldDatum, { type FieldValues } from "../../database/models/FieldDatum";
import {
  hasRequestArguments,
  isTemplatedUpsertRequest,
  minimizeAssociationsToIds,
} from "../../utils/helperFunctions";
import Field from "../../database/models/Field";
import Tag from "../../database/models/Tag";
import Transaction from "../../database/models/Transaction";
import { TransactionResponseDto } from "../apiDtos/TransactionDtos";
import { defaultLimit } from "../../utils/constants";
import type express from "express";

export async function getTransaction(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["TransactionId"] })) {
    return;
  }

  const transaction = await Transaction.findOne({
    where: {
      id: req.params.TransactionId,
    },
    include: [Field, FieldDatum, Tag],
  });
  if (transaction === null) {
    res.status(500).send({
      message: "Transaction not found.",
    });
    return;
  }

  minimizeAssociationsToIds(transaction);

  res.status(200).send({
    message: "Transaction gotten.",
    transaction: new TransactionResponseDto(transaction),
  });
}

export async function createTransaction(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !isTemplatedUpsertRequest(
      req,
      res,
      req.body?.isTemplate as boolean | undefined,
      req.body?.TemplateId as number | undefined,
      { body: ["SourceTransactorId", "RecipientTransactorId"] }
    )
  ) {
    return;
  }
  const createOptions: CreationAttributes<Transaction> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
    isTemplate: req.body.isTemplate,
  };
  if (req.body.SourceTransactorId !== undefined) {
    createOptions.SourceTransactorId = req.body.SourceTransactorId;
  }
  if (req.body.RecipientTransactorId !== undefined) {
    createOptions.RecipientTransactorId = req.body.RecipientTransactorId;
  }
  const transaction = await Transaction.create(createOptions);

  if (createOptions.isTemplate) {
    if (req.body.FieldIds !== undefined) {
      await transaction.addFields(req.body.FieldIds as number[]);
    }
  } else {
    await FieldDatum.upsertFieldData(
      req.body.fieldValues as FieldValues,
      undefined,
      undefined,
      transaction.id
    );
  }

  await transaction.loadAssociatedIds();

  res.status(200).send({
    message: "Transaction created.",
    transaction: new TransactionResponseDto(transaction),
  });
}

export async function updateTransaction(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(
      req,
      res,
      { params: ["TransactionId"] },
      {
        body: ["TemplateId", "SourceTransactorId", "RecipientTransactorId"],
      }
    )
  ) {
    return;
  }

  const transaction = await Transaction.findOne({
    where: {
      id: req.params.TransactionId,
    },
  });
  if (transaction === null) {
    res.status(500).send({
      message: "Transaction not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Transaction> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
    isTemplate: transaction.isTemplate,
    SourceTransactorId: req.body.SourceTransactorId,
    RecipientTransactorId: req.body.RecipientTransactorId,
  };
  await transaction.update(updateOptions);

  if (updateOptions.isTemplate) {
    if (req.body.FieldIds !== undefined) {
      await transaction.setFields(req.body.FieldIds as number[]);
    }
  } else {
    await FieldDatum.upsertFieldData(
      req.body.fieldValues as FieldValues,
      undefined,
      undefined,
      transaction.id
    );
  }

  await transaction.loadAssociatedIds();

  res.status(200).send({
    message: "Transaction updated.",
    transaction: new TransactionResponseDto(transaction),
  });
}

export async function getTransactions(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.isTemplate !== undefined) {
    whereOptions.isTemplate = {
      [Op.eq]: req.query.isTemplate as unknown as boolean,
    };
  }
  if (req.query.RecipientTransactorId !== undefined) {
    whereOptions.recipientTransactor = {
      [Op.eq]: (req.query.RecipientTransactorId as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.SourceTransactorId !== undefined) {
    whereOptions.sourceTransactor = {
      [Op.eq]: (req.query.SourceTransactorId as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.TagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: (req.query.TagIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.TemplateId !== undefined) {
    whereOptions.template = {
      [Op.eq]: (req.query.TemplateId as string[]).map((x) => {
        return +x;
      }),
    };
  }

  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
    include: [Field, FieldDatum, Tag],
  };
  const transactions = await Transaction.findAll(findOptions);

  const minimizedTransactions: TransactionResponseDto[] = [];
  transactions.forEach((transaction) => {
    minimizedTransactions.push(
      new TransactionResponseDto(minimizeAssociationsToIds(transaction))
    );
  });

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Transaction Templates gotten.",
      templates: minimizedTransactions,
    });
  } else {
    res.status(200).send({
      message: "Transactions gotten.",
      transactions: minimizedTransactions,
    });
  }
}
