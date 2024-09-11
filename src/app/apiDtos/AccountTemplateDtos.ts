import {
  type FieldDatumRequestDto,
  FieldDatumResponseDto,
} from "./FieldDatumDtos";
import Account from "../../database/models/Account";
import { FieldResponseDto } from "./FieldDtos";
import { GroupResponseDto } from "./GroupDtos";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import type express from "express";
import { transactorTypeEnum } from "../../utils/enumerators";

export interface AccountTemplateRequest extends express.Request {
  body: AccountTemplateRequestDto;
}

export interface AccountTemplateSearchRequest extends express.Request {
  query: AccountTemplateSearchRequestDto;
}

export interface AccountTemplateResponse extends express.Response {
  accountTemplate: AccountTemplateResponseDto;
}

export interface AccountTemplatesResponse extends express.Response {
  accountTemplates: AccountTemplateResponseDto[];
}

export interface AccountTemplateRequestDto {
  fieldIds: number[];
  fieldData?: FieldDatumRequestDto[];
  fieldDatumIds?: number[];
  isTemplate: boolean;
  name: string;
  parentGroupId: number;
  tagIds: number[];
}

export interface AccountTemplateSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  fieldIds?: string[];
  fieldDatumIds?: string[];
  isTemplate?: string;
  name?: string;
  parentGroupIds?: string[];
  tagIds?: string[];
}

export class AccountTemplateResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  fields: FieldResponseDto[] = [];
  fieldIds: number[] = [];
  fieldData: FieldDatumResponseDto[] = [];
  fieldDatumIds: number[] = [];
  isTemplate: boolean;
  name: string;
  parentGroup: GroupResponseDto | null = null;
  parentGroupId: number | null = null;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];
  transactorType = transactorTypeEnum.Account;

  constructor(accountTemplate: Account) {
    this.id = accountTemplate.id;
    this.createdAt = accountTemplate.createdAt.toISOString();
    this.updatedAt = accountTemplate.updatedAt.toISOString();
    this.isTemplate = accountTemplate.isTemplate;
    this.name = accountTemplate.name;
    this.parentGroupId = accountTemplate.ParentGroupId ?? null;
  }

  public async loadAssociations(accountTemplate: Account): Promise<void> {
    if (this.id !== accountTemplate.id) {
      throw new Error("IDs don't match.");
    }

    const fields = await accountTemplate.getFields();
    const fieldDtoPromises = fields?.map(async (field) => {
      const fieldDto = new FieldResponseDto(field);
      await fieldDto.loadAssociations(field);
      this.fields.push(fieldDto);
      this.fieldIds.push(field.id);
    });
    await Promise.all(fieldDtoPromises);

    const fieldData = await accountTemplate.getFieldData();
    fieldData?.forEach((fieldDatum) => {
      this.fieldData.push(new FieldDatumResponseDto(fieldDatum));
      this.fieldDatumIds.push(fieldDatum.id);
    });

    if (this.parentGroupId != null) {
      this.parentGroup = new GroupResponseDto(
        await accountTemplate.getParentGroup()
      );
    }

    const tags = await accountTemplate.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });
  }
}

export function AccountTemplateDtoToModel(
  accountDto: AccountTemplateRequestDto | AccountTemplateResponseDto
): Account {
  const account = Account.build({
    isTemplate: accountDto.isTemplate,
    name: accountDto.name,
    ParentGroupId: accountDto.parentGroupId ?? undefined,
  });
  return account;
}
