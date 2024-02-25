import * as FieldDatumService from "../services/FieldDatumService";
import * as TransactionRepository from "../repositories/TransactionRepository";
import { type Attributes, Op, type WhereOptions } from "sequelize";
import {
  TransactionDtoToModel,
  type TransactionRequestDto,
  type TransactionSearchRequestDto,
} from "../apiDtos/TransactionDtos";
import {
  TransactionTemplateDtoToModel,
  type TransactionTemplateRequestDto,
  type TransactionTemplateSearchRequestDto,
} from "../apiDtos/TransactionTemplateDtos";
import type FieldDatum from "../../database/models/FieldDatum";
import type Transaction from "../../database/models/Transaction";
import { defaultLimit } from "../../utils/constants";

export async function getTransaction(
  transactionId: number
): Promise<Transaction | null> {
  const transaction = await TransactionRepository.getTransaction(transactionId);
  return transaction;
}

export async function getTransactionTemplate(
  transactionTemplateId: number
): Promise<Transaction | null> {
  const transactionTemplate =
    await TransactionRepository.getTransactionTemplate(transactionTemplateId);
  return transactionTemplate;
}

export async function getTransactions(
  transactionSearchDto: TransactionSearchRequestDto
): Promise<Transaction[]> {
  const whereOptions: WhereOptions<Attributes<Transaction>> = {
    isTemplate: false,
  };
  if (transactionSearchDto.fieldIds != null) {
    whereOptions.FieldIds = {
      [Op.overlap]: transactionSearchDto.fieldIds.map((id) => +id),
    };
  }
  if (transactionSearchDto.fieldDatumIds != null) {
    whereOptions.FieldDatumIds = {
      [Op.overlap]: transactionSearchDto.fieldDatumIds.map((id) => +id),
    };
  }
  if (transactionSearchDto.recipientTransactorIds != null) {
    whereOptions.RecipientTransactorId = {
      [Op.in]: transactionSearchDto?.recipientTransactorIds?.map((id) => +id),
    };
  }
  if (transactionSearchDto.sourceTransactorIds != null) {
    whereOptions.SourceTransactorId = {
      [Op.in]: transactionSearchDto?.sourceTransactorIds?.map((id) => +id),
    };
  }
  if (transactionSearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: transactionSearchDto.tagIds.map((id) => +id),
    };
  }
  if (transactionSearchDto.templateIds != null) {
    whereOptions.TemplateId = {
      [Op.in]: transactionSearchDto?.templateIds?.map((id) => +id),
    };
  }

  const searchLimit =
    transactionSearchDto.limit != null
      ? +transactionSearchDto.limit
      : defaultLimit;
  const searchOffset =
    transactionSearchDto.offset != null ? +transactionSearchDto.offset : 0;

  const transactions = await TransactionRepository.getTransactions(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return transactions;
}

export async function getTransactionTemplates(
  transactionTemplateSearchDto: TransactionTemplateSearchRequestDto
): Promise<Transaction[]> {
  const whereOptions: WhereOptions<Attributes<Transaction>> = {
    isTemplate: true,
  };
  if (transactionTemplateSearchDto.fieldIds != null) {
    whereOptions.FieldIds = {
      [Op.overlap]: transactionTemplateSearchDto.fieldIds.map((id) => +id),
    };
  }
  if (transactionTemplateSearchDto.fieldDatumIds != null) {
    whereOptions.FieldDatumIds = {
      [Op.overlap]: transactionTemplateSearchDto.fieldDatumIds.map((id) => +id),
    };
  }
  if (transactionTemplateSearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: transactionTemplateSearchDto.name,
    };
  }
  if (transactionTemplateSearchDto.recipientTransactorIds != null) {
    whereOptions.RecipientTransactorId = {
      [Op.in]: transactionTemplateSearchDto?.recipientTransactorIds?.map(
        (id) => +id
      ),
    };
  }
  if (transactionTemplateSearchDto.sourceTransactorIds != null) {
    whereOptions.SourceTransactorId = {
      [Op.in]: transactionTemplateSearchDto?.sourceTransactorIds?.map(
        (id) => +id
      ),
    };
  }
  if (transactionTemplateSearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: transactionTemplateSearchDto.tagIds.map((id) => +id),
    };
  }

  const searchLimit =
    transactionTemplateSearchDto.limit != null
      ? +transactionTemplateSearchDto.limit
      : defaultLimit;
  const searchOffset =
    transactionTemplateSearchDto.offset != null
      ? +transactionTemplateSearchDto.offset
      : 0;

  const transactions = await TransactionRepository.getTransactions(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return transactions;
}

export async function createTransactionFromDto(
  transactionDto: TransactionRequestDto
): Promise<Transaction> {
  const transactionModel = TransactionDtoToModel(transactionDto);
  const transaction = await TransactionRepository.createOrUpdateTransaction(
    transactionModel
  );

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  transactionDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createFieldDatumFromDto(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await transaction.setFieldData(fieldData.map((fieldDatum) => fieldDatum.id));

  await transaction.setTags(transactionDto.tagIds);

  return transaction;
}

export async function createTransactionTemplateFromDto(
  transactionTemplateDto: TransactionTemplateRequestDto
): Promise<Transaction> {
  const transactionTemplateModel = TransactionTemplateDtoToModel(
    transactionTemplateDto
  );
  const transactionTemplate =
    await TransactionRepository.createOrUpdateTransaction(
      transactionTemplateModel
    );

  await transactionTemplate.setFields(transactionTemplateDto.fieldIds);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  transactionTemplateDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createFieldDatumFromDto(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await transactionTemplate.setFieldData(
    fieldData.map((fieldDatum) => fieldDatum.id)
  );

  await transactionTemplate.setTags(transactionTemplateDto.tagIds);

  return transactionTemplate;
}

export async function updateTransactionFromDto(
  id: number,
  transactionDto: TransactionRequestDto
): Promise<Transaction | null> {
  const transactionModel = await getTransaction(id);
  if (transactionModel == null) {
    return null;
  }

  if (transactionDto.templateId !== transactionModel.TemplateId) {
    await FieldDatumService.deleteFieldDataByTransactionId(id);
  }

  transactionModel.set({
    TemplateId: transactionDto.templateId,
  });

  const transaction = await TransactionRepository.createOrUpdateTransaction(
    transactionModel
  );

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  transactionDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createOrUpdateFieldDatum(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await transaction.setFieldData(fieldData.map((fieldDatum) => fieldDatum.id));

  await transaction.setTags(transactionDto.tagIds);

  return transaction;
}

export async function updateTransactionTemplateFromDto(
  id: number,
  transactionTemplateDto: TransactionTemplateRequestDto
): Promise<Transaction | null> {
  const transactionTemplateModel = await getTransactionTemplate(id);
  if (transactionTemplateModel == null) {
    return null;
  }

  transactionTemplateModel.set({
    name: transactionTemplateDto.name,
  });

  const transactionTemplate =
    await TransactionRepository.createOrUpdateTransaction(
      transactionTemplateModel
    );

  await transactionTemplate.setFields(transactionTemplateDto.fieldIds);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  transactionTemplateDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createOrUpdateFieldDatum(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await transactionTemplate.setFieldData(
    fieldData.map((fieldDatum) => fieldDatum.id)
  );

  await transactionTemplate.setTags(transactionTemplateDto.tagIds);

  return transactionTemplate;
}
