import {
  type FieldDatumRequestDto,
  FieldDatumResponseDto,
} from "./FieldDatumDtos";
import { AccountResponseDto } from "./AccountDtos";
import { EntityResponseDto } from "./EntityDtos";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import Transaction from "../../database/models/Transaction";
import { TransactionTemplateResponseDto } from "./TransactionTemplateDtos";
import type express from "express";
import { transactorTypeEnum } from "../../utils/enumerators";

export interface TransactionRequest extends express.Request {
  body: TransactionRequestDto;
}

export interface TransactionSearchRequest extends express.Request {
  query: TransactionSearchRequestDto;
}

export interface TransactionResponse extends express.Response {
  transaction: TransactionResponseDto;
}

export interface TransactionsResponse extends express.Response {
  transactions: TransactionResponseDto[];
}

export interface TransactionRequestDto {
  fieldIds?: number[];
  fieldData: FieldDatumRequestDto[];
  fieldDatumIds: number[];
  isTemplate: boolean;
  recipientTransactorId: number;
  sourceTransactorId: number;
  tagIds: number[];
  templateId: number;
}

export interface TransactionSearchRequestDto extends Query {
  createdAt?: string;
  fieldIds?: string[];
  fieldDatumIds?: string[];
  ids?: string[];
  isTemplate?: string;
  limit?: string;
  offset?: string;
  recipientTransactorIds: string[];
  sourceTransactorIds: string[];
  tagIds?: string[];
  templateIds?: string[];
  updatedAt?: string;
}

export class TransactionResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  fieldData: FieldDatumResponseDto[] = [];
  fieldDatumIds: number[] = [];
  isTemplate: boolean = false;
  recipientTransactor: AccountResponseDto | EntityResponseDto | null = null;
  recipientTransactorId: number;
  sourceTransactor: AccountResponseDto | EntityResponseDto | null = null;
  sourceTransactorId: number;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];
  template: TransactionTemplateResponseDto | null = null;
  templateId: number;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.createdAt = transaction.createdAt.toISOString();
    this.updatedAt = transaction.updatedAt.toISOString();
    this.isTemplate = transaction.isTemplate;
    if (transaction.RecipientTransactorId != null) {
      this.recipientTransactorId = transaction.RecipientTransactorId;
    } else {
      throw new Error("Must have a recipient transactor.");
    }
    if (transaction.SourceTransactorId != null) {
      this.sourceTransactorId = transaction.SourceTransactorId;
    } else {
      throw new Error("Must have a source transactor.");
    }
    if (transaction.TemplateId != null) {
      this.templateId = transaction.TemplateId;
    } else {
      throw new Error("Must have a template.");
    }
  }

  public async loadAssociations(transaction: Transaction): Promise<void> {
    if (this.id !== transaction.id) {
      throw new Error("IDs don't match.");
    }

    const fieldData = await transaction.getFieldData();
    fieldData?.forEach((fieldDatum) => {
      this.fieldData.push(new FieldDatumResponseDto(fieldDatum));
      this.fieldDatumIds.push(fieldDatum.id);
    });

    const recipientTransactor = await transaction.getRecipientTransactor();
    if (recipientTransactor == null) {
      throw new Error("Transaction does not have a Recipient Transactor");
    }
    if (recipientTransactor.TransactorTypeId === transactorTypeEnum.Account) {
      const recipientAccount = await recipientTransactor.getAccount();
      const recipientAccountDto = new AccountResponseDto(recipientAccount);
      await recipientAccountDto.loadAssociations(recipientAccount);
      this.recipientTransactor = recipientAccountDto;
    } else if (
      recipientTransactor.TransactorTypeId === transactorTypeEnum.Entity
    ) {
      const recipientEntity = await recipientTransactor.getEntity();
      const recipientEntityDto = new EntityResponseDto(recipientEntity);
      await recipientEntityDto.loadAssociations(recipientEntity);
      this.recipientTransactor = recipientEntityDto;
    } else {
      throw new Error("Recipient must be Account or Entity.");
    }

    const sourceTransactor = await transaction.getSourceTransactor();
    if (sourceTransactor == null) {
      throw new Error("Transaction does not have a Source Transactor");
    }
    if (sourceTransactor.TransactorTypeId === transactorTypeEnum.Account) {
      const sourceAccount = await sourceTransactor.getAccount();
      const sourceAccountDto = new AccountResponseDto(sourceAccount);
      await sourceAccountDto.loadAssociations(sourceAccount);
      this.sourceTransactor = sourceAccountDto;
    } else if (
      sourceTransactor.TransactorTypeId === transactorTypeEnum.Entity
    ) {
      const sourceEntity = await sourceTransactor.getEntity();
      const sourceEntityDto = new EntityResponseDto(sourceEntity);
      await sourceEntityDto.loadAssociations(sourceEntity);
      this.sourceTransactor = sourceEntityDto;
    } else {
      throw new Error("Source must be Account or Entity.");
    }

    const tags = await transaction.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });

    const transactionTemplate = await transaction.getTemplate();
    if (transactionTemplate == null) {
      throw new Error("Must have template.");
    }
    const transactionTemplateDto = new TransactionTemplateResponseDto(
      transactionTemplate
    );
    await transactionTemplateDto.loadAssociations(transactionTemplate);
    this.template = transactionTemplateDto;
  }
}

export function TransactionDtoToModel(
  transactionDto: TransactionRequestDto | TransactionResponseDto
): Transaction {
  const transaction = Transaction.build({
    isTemplate: transactionDto.isTemplate,
    RecipientTransactorId: transactionDto.recipientTransactorId,
    SourceTransactorId: transactionDto.sourceTransactorId,
    TemplateId: transactionDto.templateId,
  });
  return transaction;
}
