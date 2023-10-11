import type Field from "../../database/models/Field";

export class FieldResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  fieldDatumIds?: number[];
  fieldTypeId: number;
  accountIds?: number[];
  entityIds?: number[];
  transactionIds?: number[];
  isComponentOnly: boolean;

  constructor(field: Field) {
    this.id = field.id;
    this.createdAt = field.createdAt.toISOString();
    this.updatedAt = field.updatedAt.toISOString();
    this.name = field.name;
    this.fieldDatumIds = field.FieldDatumIds;
    this.fieldTypeId = field.FieldTypeId;
    this.accountIds = field.AccountIds;
    this.entityIds = field.EntityIds;
    this.transactionIds = field.TransactionIds;
    this.isComponentOnly = field.isComponentOnly;
  }
}
