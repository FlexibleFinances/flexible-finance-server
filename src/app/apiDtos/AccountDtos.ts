import type Account from "../../database/models/Account";
import { type FieldValue } from "../../database/models/FieldDatum";

export class AccountDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  fieldValues?: FieldValue[];
  parentGroupId?: number;
  tagIds?: number[];
  templateId: number | null;
  isTemplate: boolean;

  constructor(account: Account) {
    this.id = account.id;
    this.createdAt = account.createdAt.toISOString();
    this.updatedAt = account.updatedAt.toISOString();
    this.name = account.name;
    this.parentGroupId = account.GroupId;
    this.fieldDatumIds = account.FieldDatumIds;
    this.fieldIds = account.FieldIds;
    this.tagIds = account.TagIds;
    this.templateId = account.TemplateId;
    this.isTemplate = account.isTemplate;
  }
}
