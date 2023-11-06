import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import Transaction from "../../database/models/Transaction";

export async function getTransaction(
  transactionId: number
): Promise<Transaction | null> {
  const transaction = await Transaction.findOne({
    where: {
      id: transactionId,
      isTemplate: false,
    },
  });
  return transaction;
}

export async function getTransactionTemplate(
  transactionId: number
): Promise<Transaction | null> {
  const transaction = await Transaction.findOne({
    where: {
      id: transactionId,
      isTemplate: true,
    },
  });
  return transaction;
}

export async function getTransactions(
  transactionWhereOptions: WhereOptions<Attributes<Transaction>>,
  limit: number,
  offset: number
): Promise<Transaction[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: transactionWhereOptions,
  };

  const transactions = await Transaction.findAll(findOptions);

  return transactions;
}

export async function createOrUpdateTransaction(
  transactionModel: Transaction
): Promise<Transaction> {
  const transaction = await transactionModel.save();
  return transaction;
}
