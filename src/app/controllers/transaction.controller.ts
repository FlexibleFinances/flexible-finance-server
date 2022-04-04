import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Transaction from "../../database/models/Transaction";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getTransaction(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["transactionId"] })) {
    return;
  }

  const transaction = await Transaction.findOne({
    where: {
      id: req.params.transactionId,
    },
  });
  if (transaction === null) {
    res.status(500).send({
      message: "Transaction not found.",
    });
    return;
  }
  res.status(200).send({
    message: "Transaction gotten.",
    transaction: transaction,
  });
}

export async function createTransaction(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }
  const createOptions: CreationAttributes<Transaction> = {
    name: req.body.name,
  };
  const transaction = await Transaction.create(createOptions);
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
      { params: ["transactionId"] },
      { body: ["name"] }
    )
  ) {
    return;
  }

  const transaction = await Transaction.findOne({
    where: {
      id: req.params.transactionId,
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
  };
  await transaction.update(updateOptions);
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
  if (req.query.datumIds !== undefined) {
    whereOptions.data = {
      [Op.in]: (req.query.datumIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.fileIds !== undefined) {
    whereOptions.files = {
      [Op.in]: (req.query.fileIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.tagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: (req.query.tagIds as string[]).map((x) => {
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
  res.status(200).send({
    message: "Transactions gotten.",
    transactions: transactions,
  });
}
