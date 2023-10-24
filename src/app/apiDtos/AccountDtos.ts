import type Account from "../../database/models/Account";
import type Field from "../../database/models/Field";
import type FieldDatum from "../../database/models/FieldDatum";
import { type FieldValue } from "../../database/models/FieldDatum";
import { type GroupResponseDto } from "./GroupDtos";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import type express from "express";

export interface AccountRequest extends express.Request {
  body: AccountRequestDto;
}

export interface AccountSearchRequest extends express.Request {
  query: AccountSearchRequestDto;
}

export interface AccountResponse extends express.Response {
  account: AccountResponseDto;
}

export interface AccountsResponse extends express.Response {
  accounts: AccountResponseDto[];
}

export interface AccountRequestDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  fieldValues?: FieldValue[];
  parentGroupId?: number;
  tagIds?: number[];
  templateId?: number;
  isTemplate?: boolean;
}

export interface AccountSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  fieldDatumIds?: string[];
  fieldIds?: string[];
  fieldValues?: undefined;
  parentGroupIds?: string[];
  tagIds?: string[];
  templateIds?: string[];
  isTemplate?: string;
}

export class AccountResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  fieldValues?: FieldValue[];
  parentGroup?: GroupResponseDto;
  parentGroupId?: number;
  tags?: TagResponseDto[];
  tagIds?: number[];
  template?: AccountResponseDto;
  templateId?: number;
  isTemplate: boolean;

  constructor(account: Account) {
    this.id = account.id;
    this.createdAt = account.createdAt.toISOString();
    this.updatedAt = account.updatedAt.toISOString();
    this.name = account.name;
    this.parentGroupId = account.GroupId;
    this.tags = account.Tags?.map((tag) => new TagResponseDto(tag));
    this.tagIds = account.Tags?.map((tag) => tag.id);
    this.templateId = account.TemplateId;
    this.isTemplate = account.isTemplate;

    if (account.isTemplate) {
      if (account.Fields !== undefined) {
        this.fieldIds = account.Fields.map((field: Field) => field.id);
      }
    } else {
      if (account.FieldData !== undefined) {
        this.fieldDatumIds = account.FieldData.map(
          (fieldDatum: FieldDatum) => fieldDatum.id
        );
      }
    }
  }
}
