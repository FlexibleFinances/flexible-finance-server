import {
  type TransactionRequest,
  type TransactionResponse,
  TransactionResponseDto,
  type TransactionSearchRequest,
  type TransactionsResponse,
} from "../apiDtos/TransactionDtos";
import {
  createTransactionFromDto,
  getTransactionById,
  getTransactionsByOptions,
  updateTransactionFromDto,
} from "../repositories/TransactionRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getTransaction(
  req: TransactionRequest,
  res: TransactionResponse
): Promise<void> {
  const transaction = await getTransactionById(
    Number(req.params.transactionId)
  );

  if (transaction === null) {
    res.status(500).send({
      message: "Transaction not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Transaction gotten.",
    transaction: new TransactionResponseDto(transaction),
  });
}

export async function createTransaction(
  req: TransactionRequest,
  res: TransactionResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const transaction = await createTransactionFromDto(requestBody);

  if (transaction === null) {
    res.status(500).send({
      message: "Transaction not created.",
    });
    return;
  }

  res.status(200).send({
    message: "Transaction created.",
    transaction: new TransactionResponseDto(transaction),
  });
}

export async function updateTransaction(
  req: TransactionRequest,
  res: TransactionResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (
    !hasRequestArguments(
      req,
      res,
      { params: ["TransactionId"] },
      { body: ["name", "TemplateId", "fieldValues"] }
    )
  ) {
    return;
  }

  const transaction = await updateTransactionFromDto(requestBody);

  if (transaction === null) {
    res.status(500).send({
      message: "Transaction not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Transaction updated.",
    transaction: new TransactionResponseDto(transaction),
  });
}

export async function getTransactions(
  req: TransactionSearchRequest,
  res: TransactionsResponse
): Promise<void> {
  const requestQuery = req.query;

  const transactions = await getTransactionsByOptions(requestQuery);

  if (transactions === null) {
    res.status(500).send({
      message: "Transactions not found.",
    });
    return;
  }

  const transactionDtos = transactions.map(
    (transaction) => new TransactionResponseDto(transaction)
  );

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Transaction Templates gotten.",
      templates: transactionDtos,
    });
  } else {
    res.status(200).send({
      message: "Transactions gotten.",
      transactions: transactionDtos,
    });
  }
}
