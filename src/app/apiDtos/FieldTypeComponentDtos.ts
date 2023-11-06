import FieldTypeComponent from "../../database/models/FieldTypeComponent";
import { FieldTypeResponseDto } from "./FieldTypeDtos";
import { type Query } from "express-serve-static-core";
import type express from "express";

export interface FieldTypeComponentRequest extends express.Request {
  body: FieldTypeComponentRequestDto;
}

export interface FieldTypComponentSearchRequest extends express.Request {
  query: FieldTypeComponentSearchRequestDto;
}

export interface FieldTypeComponentResponse extends express.Response {
  fieldTypeComponent: FieldTypeComponentResponseDto;
}

export interface FieldTypesComponentResponse extends express.Response {
  fieldTypeComponents: FieldTypeComponentResponseDto[];
}

export interface FieldTypeComponentRequestDto {
  childFieldTypeId: number;
  isRequired: boolean;
  order: number;
  parentFieldTypeId: number;
  validator: string;
}

export interface FieldTypeComponentSearchRequestDto extends Query {
  createdAt?: string;
  childFieldTypeIds?: string[];
  ids?: string[];
  isRequired?: string;
  limit?: string;
  offset?: string;
  order?: string;
  parentFieldTypeIds?: string[];
  updatedAt?: string;
  validator?: string;
}

export class FieldTypeComponentResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  childFieldType: FieldTypeResponseDto | null = null;
  childFieldTypeId: number;
  isRequired: boolean;
  order: number;
  parentFieldType?: FieldTypeResponseDto;
  parentFieldTypeId: number;
  validator: string;

  constructor(fieldTypeComponent: FieldTypeComponent) {
    this.id = fieldTypeComponent.id;
    this.createdAt = fieldTypeComponent.createdAt.toISOString();
    this.updatedAt = fieldTypeComponent.updatedAt.toISOString();
    this.childFieldTypeId = fieldTypeComponent.ChildFieldType.id;
    this.isRequired = fieldTypeComponent.isRequired;
    this.order = fieldTypeComponent.order;
    this.parentFieldTypeId = fieldTypeComponent.ParentFieldType.id;
    this.validator = fieldTypeComponent.validator ?? "";
  }

  public async loadAssociations(
    fieldTypeComponent: FieldTypeComponent,
    includeParent: boolean = false
  ): Promise<void> {
    if (this.id !== fieldTypeComponent.id) {
      throw new Error("IDs don't match.");
    }

    const childFieldType = await fieldTypeComponent.getChildFieldType();
    if (childFieldType === undefined) {
      throw new Error("Must have child field type.");
    }
    this.childFieldType = new FieldTypeResponseDto(childFieldType);

    if (includeParent) {
      const parentFieldType = await fieldTypeComponent.getParentFieldType();
      if (parentFieldType === undefined) {
        throw new Error("Must have parent field type.");
      }
      this.parentFieldType = new FieldTypeResponseDto(parentFieldType);
    }
  }
}

export function FieldTypeComponentDtoToModel(
  fieldTypeComponentDto:
    | FieldTypeComponentRequestDto
    | FieldTypeComponentResponseDto
): FieldTypeComponent {
  const fieldTypeComponent = FieldTypeComponent.build({
    ChildFieldTypeId: fieldTypeComponentDto.childFieldTypeId,
    isRequired: fieldTypeComponentDto.isRequired,
    order: fieldTypeComponentDto.order,
    ParentFieldTypeId: fieldTypeComponentDto.parentFieldTypeId,
    validator: fieldTypeComponentDto.validator,
  });
  return fieldTypeComponent;
}
