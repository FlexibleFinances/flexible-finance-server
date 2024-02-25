import {
  type FieldComponentRequestDto,
  FieldComponentResponseDto,
} from "./FieldComponentDtos";
import Field from "../../database/models/Field";
import { FieldTypeResponseDto } from "./FieldTypeDtos";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import type express from "express";

export interface FieldRequest extends express.Request {
  body: FieldRequestDto;
}

export interface FieldSearchRequest extends express.Request {
  query: FieldSearchRequestDto;
}

export interface FieldResponse extends express.Response {
  field: FieldResponseDto;
}

export interface FieldsResponse extends express.Response {
  fields: FieldResponseDto[];
}

export interface FieldRequestDto {
  childFieldComponents: FieldComponentRequestDto[];
  childFieldComponentIds: number[];
  fieldTypeId: number;
  isComponentOnly: boolean;
  name: string;
  parentFieldComponent: FieldComponentRequestDto;
  parentFieldComponentId: number;
  tagIds: number[];
}

export interface FieldSearchRequestDto extends Query {
  accountIds?: string[];
  childFieldComponentIds?: string[];
  createdAt?: string;
  entityIds?: string[];
  fieldTypeIds?: string[];
  ids?: string[];
  limit?: string;
  name?: string;
  offset?: string;
  parentFieldComponentIds?: string[];
  tagIds?: string[];
  transactionIds?: string[];
  updatedAt?: string;
}

export class FieldResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  childFieldComponents: FieldComponentResponseDto[] = [];
  childFieldComponentIds: number[] = [];
  fieldType: FieldTypeResponseDto | null = null;
  fieldTypeId: number;
  isComponentOnly: boolean;
  name: string;
  parentFieldComponent?: FieldComponentRequestDto;
  parentFieldComponentId: number | null = null;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];

  constructor(field: Field) {
    this.id = field.id;
    this.createdAt = field.createdAt.toISOString();
    this.updatedAt = field.updatedAt.toISOString();
    this.fieldTypeId = field.FieldTypeId;
    this.isComponentOnly = field.isComponentOnly;
    this.name = field.name;
  }

  public async loadAssociations(field: Field): Promise<void> {
    if (this.id !== field.id) {
      throw new Error("IDs don't match.");
    }

    const childFieldComponents = await field.getChildFieldComponents();
    childFieldComponents?.forEach((childFieldComponent) => {
      this.childFieldComponents.push(
        new FieldComponentResponseDto(childFieldComponent)
      );
      this.childFieldComponentIds.push(childFieldComponent.id);
    });

    const fieldType = await field.getFieldType();
    if (fieldType == null) {
      throw new Error("Must have a field type.");
    }
    this.fieldType = new FieldTypeResponseDto(fieldType);

    const parentFieldComponent = await field.getParentFieldComponent();
    if (parentFieldComponent != null) {
      this.parentFieldComponent = new FieldComponentResponseDto(
        parentFieldComponent
      );
      this.parentFieldComponentId = parentFieldComponent.id;
    }

    const tags = await field.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });
  }
}

export function FieldDtoToModel(
  fieldDto: FieldRequestDto | FieldResponseDto
): Field {
  const field = Field.build({
    FieldTypeId: fieldDto.fieldTypeId,
    isComponentOnly: fieldDto.isComponentOnly,
    name: fieldDto.name,
  });
  return field;
}
