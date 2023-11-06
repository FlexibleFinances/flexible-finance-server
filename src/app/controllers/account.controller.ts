import * as AccountService from "../services/AccountService";
import {
  type AccountRequest,
  type AccountResponse,
  AccountResponseDto,
  type AccountSearchRequest,
  type AccountsResponse,
} from "../apiDtos/AccountDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getAccount(
  req: AccountRequest,
  res: AccountResponse
): Promise<void> {
  const account = await AccountService.getAccount(Number(req.params.id));

  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }

  const accountResponseDto = new AccountResponseDto(account);
  await accountResponseDto.loadAssociations(account);

  res.status(200).send({
    message: "Account gotten.",
    account: accountResponseDto,
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

  const account = await AccountService.createAccountFromDto(requestBody);

  if (account === null) {
    res.status(500).send({
      message: "Account not created.",
    });
    return;
  }

  const accountResponseDto = new AccountResponseDto(account);
  await accountResponseDto.loadAssociations(account);

  res.status(200).send({
    message: "Account created.",
    account: accountResponseDto,
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
      { body: ["name", "parentGroupId", "templateId"] }
    )
  ) {
    return;
  }

  const account = await AccountService.updateAccountFromDto(
    Number(req.params.id),
    requestBody
  );

  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }

  const accountResponseDto = new AccountResponseDto(account);
  await accountResponseDto.loadAssociations(account);

  res.status(200).send({
    message: "Account updated.",
    account: accountResponseDto,
  });
}

export async function getAccounts(
  req: AccountSearchRequest,
  res: AccountsResponse
): Promise<void> {
  const requestQuery = req.query;

  const accounts = await AccountService.getAccounts(requestQuery);

  if (accounts === null) {
    res.status(500).send({
      message: "Accounts not found.",
    });
    return;
  }

  const accountResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const accountResponseDtos = accounts.map((account) => {
    const accountReponseDto = new AccountResponseDto(account);
    accountResponseDtoAssocciationsPromises.push(
      accountReponseDto.loadAssociations(account)
    );
    return accountReponseDto;
  });
  await Promise.all(accountResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Accounts gotten.",
    accounts: accountResponseDtos,
  });
}
