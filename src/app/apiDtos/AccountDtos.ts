import type Account from "../../database/models/Account";

export class AccountResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  groupId?: number;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  tagIds?: number[];
  templateId: number | null;
  isTemplate: boolean;

  constructor(account: Account) {
    this.id = account.id;
    this.createdAt = account.createdAt.toISOString();
    this.updatedAt = account.updatedAt.toISOString();
    this.name = account.name;
    this.groupId = account.GroupId;
    this.fieldDatumIds = account.FieldDatumIds;
    this.fieldIds = account.FieldIds;
    this.tagIds = account.TagIds;
    this.templateId = account.TemplateId;
    this.isTemplate = account.isTemplate;
  }
}
