import * as TransactionService from "../services/TransactionService";
import {
  type TransactionTemplateRequest,
  type TransactionTemplateResponse,
  TransactionTemplateResponseDto,
  type TransactionTemplateSearchRequest,
  type TransactionTemplatesResponse,
} from "../apiDtos/TransactionTemplateDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getTransactionTemplate(
  req: TransactionTemplateRequest,
  res: TransactionTemplateResponse
): Promise<void> {
  const transactionTemplate = await TransactionService.getTransactionTemplate(
    Number(req.params.id)
  );

  if (transactionTemplate === null) {
    res.status(500).send({
      message: "Transaction not found.",
    });
    return;
  }

  const transactionTemplateResponseDto = new TransactionTemplateResponseDto(
    transactionTemplate
  );
  await transactionTemplateResponseDto.loadAssociations(transactionTemplate);

  res.status(200).send({
    message: "Transaction Template gotten.",
    transactionTemplate: transactionTemplateResponseDto,
  });
}

export async function createTransactionTemplate(
  req: TransactionTemplateRequest,
  res: TransactionTemplateResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const transactionTemplate =
    await TransactionService.createTransactionTemplateFromDto(requestBody);

  if (transactionTemplate === null) {
    res.status(500).send({
      message: "Transaction Template not created.",
    });
    return;
  }

  const transactionTemplateResponseDto = new TransactionTemplateResponseDto(
    transactionTemplate
  );
  await transactionTemplateResponseDto.loadAssociations(transactionTemplate);

  res.status(200).send({
    message: "Transaction Template created.",
    transactionTemplate: transactionTemplateResponseDto,
  });
}

export async function updateTransactionTemplate(
  req: TransactionTemplateRequest,
  res: TransactionTemplateResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (!hasRequestArguments(req, res, { params: ["id"] }, { body: ["name"] })) {
    return;
  }

  const transactionTemplate =
    await TransactionService.updateTransactionTemplateFromDto(
      Number(req.params.id),
      requestBody
    );

  if (transactionTemplate === null) {
    res.status(500).send({
      message: "Transaction Template not found.",
    });
    return;
  }

  const transactionTemplateResponseDto = new TransactionTemplateResponseDto(
    transactionTemplate
  );
  await transactionTemplateResponseDto.loadAssociations(transactionTemplate);

  res.status(200).send({
    message: "Transaction Template updated.",
    transactionTemplate: transactionTemplateResponseDto,
  });
}

export async function getTransactionTemplates(
  req: TransactionTemplateSearchRequest,
  res: TransactionTemplatesResponse
): Promise<void> {
  const requestQuery = req.query;

  const transactionTemplates = await TransactionService.getTransactionTemplates(
    requestQuery
  );

  if (transactionTemplates === null) {
    res.status(500).send({
      message: "Transaction Templates not found.",
    });
    return;
  }

  const transactionTemplateResponseDtoAssocciationsPromises: Array<
    Promise<void>
  > = [];
  const transactionTemplateResponseDtos = transactionTemplates.map(
    (transactionTemplate) => {
      const transactionTemplateReponseDto = new TransactionTemplateResponseDto(
        transactionTemplate
      );
      transactionTemplateResponseDtoAssocciationsPromises.push(
        transactionTemplateReponseDto.loadAssociations(transactionTemplate)
      );
      return transactionTemplateReponseDto;
    }
  );
  await Promise.all(transactionTemplateResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Transaction Templates gotten.",
    transactionTemplates: transactionTemplateResponseDtos,
  });
}
