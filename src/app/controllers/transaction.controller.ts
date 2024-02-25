import * as TransactionService from "../services/TransactionService";
import {
  type TransactionRequest,
  type TransactionResponse,
  TransactionResponseDto,
  type TransactionSearchRequest,
  type TransactionsResponse,
} from "../apiDtos/TransactionDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getTransaction(
  req: TransactionRequest,
  res: TransactionResponse
): Promise<void> {
  const transaction = await TransactionService.getTransaction(
    Number(req.params.id)
  );

  if (transaction == null) {
    res.status(500).send({
      message: "Transaction not found.",
    });
    return;
  }

  const transactionResponseDto = new TransactionResponseDto(transaction);
  await transactionResponseDto.loadAssociations(transaction);

  res.status(200).send({
    message: "Transaction gotten.",
    transaction: transactionResponseDto,
  });
}

export async function createTransaction(
  req: TransactionRequest,
  res: TransactionResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const transaction = await TransactionService.createTransactionFromDto(
    requestBody
  );

  if (transaction == null) {
    res.status(500).send({
      message: "Transaction not created.",
    });
    return;
  }

  const transactionResponseDto = new TransactionResponseDto(transaction);
  await transactionResponseDto.loadAssociations(transaction);

  res.status(200).send({
    message: "Transaction created.",
    transaction: transactionResponseDto,
  });
}

export async function updateTransaction(
  req: TransactionRequest,
  res: TransactionResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (
    !hasRequestArguments(
      req,
      res,
      { params: ["id"] },
      { body: ["recipientTransactorId", "sourceTransactorId"] }
    )
  ) {
    return;
  }

  const transaction = await TransactionService.updateTransactionFromDto(
    Number(req.params.id),
    requestBody
  );

  if (transaction == null) {
    res.status(500).send({
      message: "Transaction not found.",
    });
    return;
  }

  const transactionResponseDto = new TransactionResponseDto(transaction);
  await transactionResponseDto.loadAssociations(transaction);

  res.status(200).send({
    message: "Transaction updated.",
    transaction: transactionResponseDto,
  });
}

export async function getTransactions(
  req: TransactionSearchRequest,
  res: TransactionsResponse
): Promise<void> {
  const requestQuery = req.query;

  const transactions = await TransactionService.getTransactions(requestQuery);

  if (transactions == null) {
    res.status(500).send({
      message: "Transactions not found.",
    });
    return;
  }

  const transactionResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const transactionResponseDtos = transactions.map((transaction) => {
    const transactionReponseDto = new TransactionResponseDto(transaction);
    transactionResponseDtoAssocciationsPromises.push(
      transactionReponseDto.loadAssociations(transaction)
    );
    return transactionReponseDto;
  });
  await Promise.all(transactionResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Transactions gotten.",
    transactions: transactionResponseDtos,
  });
}
