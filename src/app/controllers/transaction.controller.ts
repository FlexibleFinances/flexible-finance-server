import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import FieldDatum from "../../database/models/FieldDatum";
import Transaction from "../../database/models/Transaction";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getTransaction(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["TransactionId"] })) {
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

  await transaction.setFieldDatumAndFieldIds();

  res.status(200).send({
    message: "Transaction gotten.",
    transaction: transaction,
  });
}

export async function createTransaction(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name", "TemplateId"] })) {
    return;
  }
  const createOptions: CreationAttributes<Transaction> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
  };
  const transaction = await Transaction.create(createOptions);

  await FieldDatum.createFieldData(
    req.body.fieldValues,
    undefined,
    undefined,
    transaction.id
  );
  await transaction.reload();
  await transaction.setFieldDatumAndFieldIds();

  res
    .status(200)
    .send({ message: "Transaction created.", transaction: transaction });
}

export async function updateTransaction(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["TransactionId"] },
      { body: ["name", "TemplateId"] }
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
  };
  await transaction.update(updateOptions);

  await transaction.setFieldDatumAndFieldIds();

  res.status(200).send({
    message: "Transaction updated.",
    transaction: transaction,
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
  if (req.query.fileIds !== undefined) {
    whereOptions.files = {
      [Op.in]: (req.query.fileIds as string[]).map((x) => {
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
  if (req.query.TemplateIds !== undefined) {
    whereOptions.template = {
      [Op.in]: (req.query.TemplateIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const transactions = await Transaction.findAll(findOptions);

  const transactionFieldPromises = transactions.map(async (transaction) => {
    return await transaction.setFieldDatumAndFieldIds();
  });

  const transactionsWithFields = await Promise.all(transactionFieldPromises);

  res.status(200).send({
    message: "Transactions gotten.",
    transactions: transactionsWithFields,
  });
}
