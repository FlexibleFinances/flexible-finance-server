import type Transaction from "../../database/models/Transaction";

export class TransactionResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  isTemplate: boolean;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  tagIds?: number[];
  templateId: number | null;
  sourceTransactorId: number;
  recipientTransactorId: number;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.createdAt = transaction.createdAt.toISOString();
    this.updatedAt = transaction.updatedAt.toISOString();
    this.name = transaction.name;
    this.isTemplate = transaction.isTemplate;
    this.fieldDatumIds = transaction.FieldDatumIds;
    this.fieldIds = transaction.FieldIds;
    this.tagIds = transaction.TagIds;
    this.templateId = transaction.TemplateId;
    this.sourceTransactorId = transaction.SourceTransactorId;
    this.recipientTransactorId = transaction.RecipientTransactorId;
  }
}
