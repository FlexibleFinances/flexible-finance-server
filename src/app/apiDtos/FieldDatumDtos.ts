import { type AccountResponseDto } from "./AccountDtos";
import { type EntityResponseDto } from "./EntityDtos";
import FieldDatum from "../../database/models/FieldDatum";
import { FieldResponseDto } from "./FieldDtos";
import { type Query } from "express-serve-static-core";
import { type TransactionResponseDto } from "./TransactionDtos";
import type express from "express";

export interface FieldDatumRequest extends express.Request {
  body: FieldDatumRequestDto;
}

export interface FieldDatumSearchRequest extends express.Request {
  query: FieldDatumSearchRequestDto;
}

export interface FieldDatumResponse extends express.Response {
  fieldDatum: FieldDatumResponseDto;
}

export interface FieldDataResponse extends express.Response {
  fieldData: FieldDatumResponseDto[];
}

export interface FieldDatumRequestDto {
  accountId?: number;
  boolValue?: boolean;
  dateValue?: Date;
  entityId?: number;
  fieldId: number;
  intValue?: number;
  stringValue?: string;
  transactionId?: number;
}

export interface FieldDatumSearchRequestDto extends Query {
  accountIds?: string[];
  createdAt?: string;
  entityIds?: string[];
  fieldIds?: string[];
  ids?: string[];
  limit?: string;
  offset?: string;
  transactionIds?: string[];
  updatedAt?: string;
}

export class FieldDatumResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  account?: AccountResponseDto;
  accountId?: number;
  boolValue?: boolean;
  dateValue?: Date;
  entity?: EntityResponseDto;
  entityId?: number;
  field: FieldResponseDto | null = null;
  fieldId: number;
  intValue?: number;
  stringValue?: string;
  transaction?: TransactionResponseDto;
  transactionId?: number;

  constructor(fieldDatum: FieldDatum) {
    this.id = fieldDatum.id;
    this.createdAt = fieldDatum.createdAt.toISOString();
    this.updatedAt = fieldDatum.updatedAt.toISOString();
    this.accountId = fieldDatum.AccountId;
    this.boolValue = fieldDatum.boolValue;
    this.dateValue = fieldDatum.dateValue;
    this.entityId = fieldDatum.EntityId;
    this.fieldId = fieldDatum.FieldId;
    this.intValue = fieldDatum.intValue;
    this.stringValue = fieldDatum.stringValue;
    this.transactionId = fieldDatum.TransactionId;
  }

  public async loadAssociations(fieldDatum: FieldDatum): Promise<void> {
    if (this.id !== fieldDatum.id) {
      throw new Error("IDs don't match.");
    }

    const field = await fieldDatum.getField();
    if (field == null) {
      throw new Error("Must have field.");
    }
    const fieldDto = new FieldResponseDto(field);
    await fieldDto.loadAssociations(field);
    this.field = fieldDto;
  }
}

export function FieldDatumDtoToModel(
  fieldDatumDto: FieldDatumRequestDto | FieldDatumResponseDto
): FieldDatum {
  const fieldDatum = FieldDatum.build({
    AccountId: fieldDatumDto.accountId,
    EntityId: fieldDatumDto.entityId,
    FieldId: fieldDatumDto.fieldId,
    TransactionId: fieldDatumDto.transactionId,
    boolValue: fieldDatumDto.boolValue,
    dateValue: fieldDatumDto.dateValue,
    intValue: fieldDatumDto.intValue,
    stringValue: fieldDatumDto.stringValue,
  });
  return fieldDatum;
}
