import {
  Transaction,
  TransactionCreationAttributes,
  TransactionUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getTransaction(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["transactionId"] })) {
    return;
  }

  void Transaction.findOne({
    where: {
      id: req.params.transactionId,
    },
  })
    .then((transaction) => {
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
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createTransaction(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["name", "typeId"] })) {
    return;
  }
  const createOptions: TransactionCreationAttributes = {
    name: req.body.name,
  };

  if (req.body.datumIds !== undefined) {
    createOptions.data = req.body.datumIds;
  }
  if (req.body.fileIds !== undefined) {
    createOptions.files = req.body.fileIds;
  }
  if (req.body.tagIds !== undefined) {
    createOptions.tags = req.body.tagIds;
  }

  Transaction.create(createOptions)
    .then((newTransaction) => {
      res
        .status(200)
        .send({ message: "Transaction created.", transaction: newTransaction });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateTransaction(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["transactionId"] })) {
    return;
  }

  void Transaction.findOne({
    where: {
      id: req.params.transactionId,
    },
  })
    .then((transaction) => {
      if (transaction === null) {
        res.status(500).send({
          message: "Transaction not found.",
        });
        return;
      }
      const updateOptions: TransactionUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.datumIds !== undefined) {
        updateOptions.data = req.body.datumIds;
      }
      if (req.body.fileIds !== undefined) {
        updateOptions.files = req.body.fileIds;
      }
      if (req.body.tagIds !== undefined) {
        updateOptions.tags = req.body.tagIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Transaction attributes provided.",
        });
        return;
      }

      transaction
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Transaction updated.",
            transaction: transaction,
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

export function getTransactions(
  req: express.Request,
  res: express.Response
): void {
  const whereOptions: sequelize.WhereOptions = {};
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

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void Transaction.findAll(findOptions)
    .then((transactions) => {
      res.status(200).send({
        message: "Transactions gotten.",
        transactions: transactions,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
