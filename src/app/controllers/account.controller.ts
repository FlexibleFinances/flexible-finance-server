import {
  type AccountRequest,
  type AccountResponse,
  AccountResponseDto,
  type AccountSearchRequest,
  type AccountsResponse,
} from "../apiDtos/AccountDtos";
import {
  createAccountFromDto,
  getAccountById,
  getAccountsByOptions,
  updateAccountFromDto,
} from "../repositories/AccountRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getAccount(
  req: AccountRequest,
  res: AccountResponse
): Promise<void> {
  const account = await getAccountById(Number(req.params.id));

  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Account gotten.",
    account: new AccountResponseDto(account),
  });
}

export async function createAccount(
  req: AccountRequest,
  res: AccountResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const account = await createAccountFromDto(requestBody);

  if (account === null) {
    res.status(500).send({
      message: "Account not created.",
    });
    return;
  }

  res.status(200).send({
    message: "Account created.",
    account: new AccountResponseDto(account),
  });
}

export async function updateAccount(
  req: AccountRequest,
  res: AccountResponse
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
      { params: ["id"] },
      { body: ["name", "groupId", "templateId", "fieldValues"] }
    )
  ) {
    return;
  }

  const account = await updateAccountFromDto(
    Number(req.params.id),
    requestBody
  );

  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Account updated.",
    account: new AccountResponseDto(account),
  });
}

export async function getAccounts(
  req: AccountSearchRequest,
  res: AccountsResponse
): Promise<void> {
  const requestQuery = req.query;

  const accounts = await getAccountsByOptions(requestQuery);

  if (accounts === null) {
    res.status(500).send({
      message: "Accounts not found.",
    });
    return;
  }

  const accountDtos = accounts.map(
    (account) => new AccountResponseDto(account)
  );

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Account Templates gotten.",
      templates: accountDtos,
    });
  } else {
    res.status(200).send({
      message: "Accounts gotten.",
      accounts: accountDtos,
    });
  }
}
