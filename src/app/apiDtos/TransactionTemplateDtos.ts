import { type DineroSnapshot, dinero, toSnapshot } from "dinero.js";
import {
  type FieldDatumRequestDto,
  FieldDatumResponseDto,
} from "./FieldDatumDtos";
import { AccountResponseDto } from "./AccountDtos";
import { EntityResponseDto } from "./EntityDtos";
import { FieldResponseDto } from "./FieldDtos";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import Transaction from "../../database/models/Transaction";
import type express from "express";
import { transactorTypeEnum } from "../../utils/enumerators";

export interface TransactionTemplateRequest extends express.Request {
  body: TransactionTemplateRequestDto;
}

export interface TransactionTemplateSearchRequest extends express.Request {
  query: TransactionTemplateSearchRequestDto;
}

export interface TransactionTemplateResponse extends express.Response {
  transactionTemplate: TransactionTemplateResponseDto;
}

export interface TransactionTemplatesResponse extends express.Response {
  transactionTemplates: TransactionTemplateResponseDto[];
}

export interface TransactionTemplateRequestDto {
  amount: DineroSnapshot<number>;
  fieldIds: number[];
  fieldData?: FieldDatumRequestDto[];
  fieldDatumIds?: number[];
  isTemplate: boolean;
  name: string;
  recipientTransactorId: number;
  sourceTransactorId: number;
  tagIds: number[];
}

export interface TransactionTemplateSearchRequestDto extends Query {
  createdAt?: string;
  fieldIds?: string[];
  fieldDatumIds?: string[];
  ids?: string[];
  isTemplate?: string;
  limit?: string;
  name?: string;
  offset?: string;
  recipientTransactorIds: string[];
  sourceTransactorIds: string[];
  tagIds?: string[];
  updatedAt?: string;
}

export class TransactionTemplateResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  amount: DineroSnapshot<number>;
  fields: FieldResponseDto[] = [];
  fieldIds: number[] = [];
  fieldData: FieldDatumResponseDto[] = [];
  fieldDatumIds: number[] = [];
  isTemplate: boolean = true;
  name: string;
  recipientTransactor: AccountResponseDto | EntityResponseDto | null = null;
  recipientTransactorId: number | null = null;
  sourceTransactor: AccountResponseDto | EntityResponseDto | null = null;
  sourceTransactorId: number | null = null;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];

  constructor(transactionTemplate: Transaction) {
    this.id = transactionTemplate.id;
    this.createdAt = transactionTemplate.createdAt.toISOString();
    this.updatedAt = transactionTemplate.updatedAt.toISOString();
    this.amount = toSnapshot(transactionTemplate.amount);
    this.isTemplate = transactionTemplate.isTemplate;
    this.name = transactionTemplate.name;
    this.recipientTransactorId =
      transactionTemplate.RecipientTransactorId ?? null;
    this.sourceTransactorId = transactionTemplate.SourceTransactorId ?? null;
  }

  public async loadAssociations(
    transactionTemplate: Transaction
  ): Promise<void> {
    if (this.id !== transactionTemplate.id) {
      throw new Error("IDs don't match.");
    }

    const fields = await transactionTemplate.getFields();
    const fieldDtoPromises = fields?.map(async (field) => {
      const fieldDto = new FieldResponseDto(field);
      await fieldDto.loadAssociations(field);
      this.fields.push(fieldDto);
      this.fieldIds.push(field.id);
    });
    await Promise.all(fieldDtoPromises);

    const fieldData = await transactionTemplate.getFieldData();
    fieldData?.forEach((fieldDatum) => {
      this.fieldData.push(new FieldDatumResponseDto(fieldDatum));
      this.fieldDatumIds.push(fieldDatum.id);
    });

    if (this.recipientTransactorId != null) {
      const recipientTransactor =
        await transactionTemplate.getRecipientTransactor();
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
    }

    if (this.sourceTransactorId != null) {
      const sourceTransactor = await transactionTemplate.getSourceTransactor();
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
    }

    const tags = await transactionTemplate.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });
  }
}

export function TransactionTemplateDtoToModel(
  transactionDto: TransactionTemplateRequestDto | TransactionTemplateResponseDto
): Transaction {
  const transaction = Transaction.build({
    isTemplate: transactionDto.isTemplate,
    amount: dinero(transactionDto.amount),
    name: transactionDto.name,
    RecipientTransactorId: transactionDto.recipientTransactorId ?? undefined,
    SourceTransactorId: transactionDto.sourceTransactorId ?? undefined,
  });
  return transaction;
}
