import type Field from "../../database/models/Field";
import type FieldDatum from "../../database/models/FieldDatum";
import { type FieldValue } from "../../database/models/FieldDatum";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import type Transaction from "../../database/models/Transaction";
import type express from "express";

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
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  fieldValues?: FieldValue[];
  tagIds?: number[];
  templateId?: number;
  isTemplate?: boolean;
}

export interface TransactionSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  fieldDatumIds?: string[];
  fieldIds?: string[];
  fieldValues?: undefined;
  tagIds?: string[];
  templateIds?: string[];
  isTemplate?: string;
}

export class TransactionResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  fieldValues?: FieldValue[];
  tags?: TagResponseDto[];
  tagIds?: number[];
  template?: TransactionResponseDto;
  templateId?: number;
  isTemplate: boolean;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.createdAt = transaction.createdAt.toISOString();
    this.updatedAt = transaction.updatedAt.toISOString();
    this.name = transaction.name;
    this.tags = transaction.Tags?.map((tag) => new TagResponseDto(tag));
    this.tagIds = transaction.Tags?.map((tag) => tag.id);
    this.templateId = transaction.TemplateId;
    this.isTemplate = transaction.isTemplate;

    if (transaction.isTemplate) {
      if (transaction.Fields !== undefined) {
        this.fieldIds = transaction.Fields.map((field: Field) => field.id);
      }
    } else {
      if (transaction.FieldData !== undefined) {
        this.fieldDatumIds = transaction.FieldData.map(
          (fieldDatum: FieldDatum) => fieldDatum.id
        );
      }
    }
  }
}
