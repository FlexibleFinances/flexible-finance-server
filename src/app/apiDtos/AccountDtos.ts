import {
  type FieldDatumRequestDto,
  FieldDatumResponseDto,
} from "./FieldDatumDtos";
import Account from "../../database/models/Account";
import { AccountTemplateResponseDto } from "./AccountTemplateDtos";
import { GroupResponseDto } from "./GroupDtos";
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
  fieldData: FieldDatumRequestDto[];
  fieldDatumIds: number[];
  isTemplate: boolean;
  name: string;
  parentGroupId: number;
  tagIds: number[];
  templateId: number;
}

export interface AccountSearchRequestDto extends Query {
  createdAt?: string;
  fieldIds?: string[];
  fieldDatumIds?: string[];
  ids?: string[];
  isTemplate?: string;
  limit?: string;
  name?: string;
  offset?: string;
  parentGroupIds?: string[];
  tagIds?: string[];
  templateIds?: string[];
  updatedAt?: string;
}

export class AccountResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  fieldData: FieldDatumResponseDto[] = [];
  fieldDatumIds: number[] = [];
  isTemplate: boolean;
  name: string;
  parentGroup: GroupResponseDto | null = null;
  parentGroupId: number | null = null;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];
  template: AccountTemplateResponseDto | null = null;
  templateId: number;

  constructor(account: Account) {
    this.id = account.id;
    this.createdAt = account.createdAt.toISOString();
    this.updatedAt = account.updatedAt.toISOString();
    this.isTemplate = account.isTemplate;
    this.name = account.name;
    this.parentGroupId = account.ParentGroupId ?? null;
    if (account.TemplateId != null) {
      this.templateId = account.TemplateId;
    } else {
      throw new Error("Must have a template.");
    }
  }

  public async loadAssociations(account: Account): Promise<void> {
    if (this.id !== account.id) {
      throw new Error("IDs don't match.");
    }

    const fieldData = await account.getFieldData();
    const fieldDataPromises: Array<Promise<void>> = [];
    fieldData?.forEach((fieldDatum) => {
      const fieldDatumResponseDto = new FieldDatumResponseDto(fieldDatum);
      fieldDataPromises.push(
        fieldDatumResponseDto.loadAssociations(fieldDatum)
      );
      this.fieldData.push(fieldDatumResponseDto);
      this.fieldDatumIds.push(fieldDatum.id);
    });
    await Promise.all(fieldDataPromises);

    if (this.parentGroupId != null) {
      this.parentGroup = new GroupResponseDto(await account.getParentGroup());
    }

    const tags = await account.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });

    const accountTemplate = await account.getTemplate();
    const accountTemplateDto = new AccountTemplateResponseDto(accountTemplate);
    await accountTemplateDto.loadAssociations(accountTemplate);
    this.template = accountTemplateDto;
  }
}

export function AccountDtoToModel(
  accountDto: AccountRequestDto | AccountResponseDto
): Account {
  const account = Account.build({
    isTemplate: accountDto.isTemplate,
    name: accountDto.name,
    ParentGroupId: accountDto.parentGroupId ?? undefined,
    TemplateId: accountDto.templateId,
  });
  return account;
}
