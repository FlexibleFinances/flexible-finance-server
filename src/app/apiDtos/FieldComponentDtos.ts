import FieldComponent from "../../database/models/FieldComponent";
import { FieldResponseDto } from "./FieldDtos";
import { type Query } from "express-serve-static-core";
import type express from "express";

export interface FieldComponentRequest extends express.Request {
  body: FieldComponentRequestDto;
}

export interface FieldTypComponentSearchRequest extends express.Request {
  query: FieldComponentSearchRequestDto;
}

export interface FieldComponentResponse extends express.Response {
  fieldComponent: FieldComponentResponseDto;
}

export interface FieldTypesComponentResponse extends express.Response {
  fieldComponents: FieldComponentResponseDto[];
}

export interface FieldComponentRequestDto {
  childFieldId: number;
  parentFieldId: number;
}

export interface FieldComponentSearchRequestDto extends Query {
  childFieldIds?: string[];
  createdAt?: string;
  ids?: string[];
  limit?: string;
  offset?: string;
  parentFieldIds?: string[];
  updatedAt?: string;
}

export class FieldComponentResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  childField: FieldResponseDto | null = null;
  childFieldId: number;
  parentField?: FieldResponseDto;
  parentFieldId: number;

  constructor(fieldComponent: FieldComponent) {
    this.id = fieldComponent.id;
    this.createdAt = fieldComponent.createdAt.toISOString();
    this.updatedAt = fieldComponent.updatedAt.toISOString();
    this.childFieldId = fieldComponent.ChildFieldId;
    this.parentFieldId = fieldComponent.ParentFieldId;
  }

  public async loadAssociations(
    fieldComponent: FieldComponent,
    includeParent: boolean = false
  ): Promise<void> {
    if (this.id !== fieldComponent.id) {
      throw new Error("IDs don't match.");
    }

    const childField = await fieldComponent.getChildField();
    if (childField == null) {
      throw new Error("Must have chlid field.");
    }
    this.childField = new FieldResponseDto(childField);

    if (includeParent) {
      const parentField = await fieldComponent.getParentField();
      if (parentField == null) {
        throw new Error("Must have parent field.");
      }
      this.parentField = new FieldResponseDto(parentField);
    }
  }
}

export function FieldComponentDtoToModel(
  fieldComponentDto: FieldComponentRequestDto | FieldComponentResponseDto
): FieldComponent {
  const fieldComponent = FieldComponent.build({
    ChildFieldId: fieldComponentDto.childFieldId,
    ParentFieldId: fieldComponentDto.parentFieldId,
  });
  return fieldComponent;
}
