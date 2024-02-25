import * as AccountService from "../services/AccountService";
import {
  type AccountTemplateRequest,
  type AccountTemplateResponse,
  AccountTemplateResponseDto,
  type AccountTemplateSearchRequest,
  type AccountTemplatesResponse,
} from "../apiDtos/AccountTemplateDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getAccountTemplate(
  req: AccountTemplateRequest,
  res: AccountTemplateResponse
): Promise<void> {
  const accountTemplate = await AccountService.getAccountTemplate(
    Number(req.params.id)
  );

  if (accountTemplate == null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }

  const accountTemplateResponseDto = new AccountTemplateResponseDto(
    accountTemplate
  );
  await accountTemplateResponseDto.loadAssociations(accountTemplate);

  res.status(200).send({
    message: "Account Template gotten.",
    accountTemplate: accountTemplateResponseDto,
  });
}

export async function createAccountTemplate(
  req: AccountTemplateRequest,
  res: AccountTemplateResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const accountTemplate = await AccountService.createAccountTemplateFromDto(
    requestBody
  );

  if (accountTemplate == null) {
    res.status(500).send({
      message: "Account Template not created.",
    });
    return;
  }

  const accountTemplateResponseDto = new AccountTemplateResponseDto(
    accountTemplate
  );
  await accountTemplateResponseDto.loadAssociations(accountTemplate);

  res.status(200).send({
    message: "Account Template created.",
    accountTemplate: accountTemplateResponseDto,
  });
}

export async function updateAccountTemplate(
  req: AccountTemplateRequest,
  res: AccountTemplateResponse
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
      { body: ["name", "parentGroupId"] }
    )
  ) {
    return;
  }

  const accountTemplate = await AccountService.updateAccountTemplateFromDto(
    Number(req.params.id),
    requestBody
  );

  if (accountTemplate == null) {
    res.status(500).send({
      message: "Account Template not found.",
    });
    return;
  }

  const accountTemplateResponseDto = new AccountTemplateResponseDto(
    accountTemplate
  );
  await accountTemplateResponseDto.loadAssociations(accountTemplate);

  res.status(200).send({
    message: "Account Template updated.",
    accountTemplate: accountTemplateResponseDto,
  });
}

export async function getAccountTemplates(
  req: AccountTemplateSearchRequest,
  res: AccountTemplatesResponse
): Promise<void> {
  const requestQuery = req.query;

  const accountTemplates = await AccountService.getAccountTemplates(
    requestQuery
  );

  if (accountTemplates == null) {
    res.status(500).send({
      message: "Account Templates not found.",
    });
    return;
  }

  const accountTemplateResponseDtoAssocciationsPromises: Array<Promise<void>> =
    [];
  const accountTemplateResponseDtos = accountTemplates.map(
    (accountTemplate) => {
      const accountTemplateReponseDto = new AccountTemplateResponseDto(
        accountTemplate
      );
      accountTemplateResponseDtoAssocciationsPromises.push(
        accountTemplateReponseDto.loadAssociations(accountTemplate)
      );
      return accountTemplateReponseDto;
    }
  );
  await Promise.all(accountTemplateResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Account Templates gotten.",
    accountTemplates: accountTemplateResponseDtos,
  });
}
