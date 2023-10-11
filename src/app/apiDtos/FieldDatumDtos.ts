import type FieldDatum from "../../database/models/FieldDatum";
import { fieldTypeTypeEnum } from "../../utils/enumerators";

export class FieldDatumResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  fieldId: number;
  accountId?: number;
  entityId?: number;
  transactionId?: number;
  boolValue?: boolean;
  dateValue?: string;
  intValue?: number;
  stringValue?: string;

  constructor(fieldDatum: FieldDatum) {
    this.id = fieldDatum.id;
    this.createdAt = fieldDatum.createdAt.toISOString();
    this.updatedAt = fieldDatum.updatedAt.toISOString();
    this.fieldId = fieldDatum.FieldId;

    if (
      [
        fieldDatum.AccountId,
        fieldDatum.EntityId,
        fieldDatum.TransactionId,
      ].filter((e) => e !== undefined).length !== 1
    ) {
      throw new Error(
        "A FieldDatum must be associated with exactly 1 Account, Entity, or Transaction."
      );
    }
    this.accountId = fieldDatum.AccountId;
    this.entityId = fieldDatum.EntityId;
    this.transactionId = fieldDatum.TransactionId;

    const fieldType = fieldDatum.Field.FieldType;
    if (fieldType.type === fieldTypeTypeEnum.Boolean) {
      this.boolValue = fieldDatum.boolValue;
    } else if (fieldType.type === fieldTypeTypeEnum.Date) {
      this.dateValue = fieldDatum.dateValue.toISOString();
    } else if (fieldType.type === fieldTypeTypeEnum.Number) {
      this.intValue = fieldDatum.intValue;
    } else if (fieldType.type === fieldTypeTypeEnum.Text) {
      this.stringValue = fieldDatum.stringValue;
    }
  }
}
