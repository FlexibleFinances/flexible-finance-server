import type FieldType from "../../database/models/FieldType";

export class FieldTypeResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  type?: string;
  validator?: string;
  fieldTypeComponentIds?: number[];
  fieldIds?: number[];

  constructor(fieldType: FieldType) {
    this.id = fieldType.id;
    this.createdAt = fieldType.createdAt.toISOString();
    this.updatedAt = fieldType.updatedAt.toISOString();
    this.name = fieldType.name;
    this.type = fieldType.type;
    this.validator = fieldType.validator;
    this.fieldTypeComponentIds = fieldType.FieldTypeComponentIds;
    this.fieldIds = fieldType.FieldIds;
  }
}
