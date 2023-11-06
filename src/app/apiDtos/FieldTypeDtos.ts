import {
  type FieldTypeComponentRequestDto,
  FieldTypeComponentResponseDto,
} from "./FieldTypeComponentDtos";
import FieldType from "../../database/models/FieldType";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import type express from "express";
import { type fieldTypeTypeEnum } from "../../utils/enumerators";

export interface FieldTypeRequest extends express.Request {
  body: FieldTypeRequestDto;
}

export interface FieldTypeSearchRequest extends express.Request {
  query: FieldTypeSearchRequestDto;
}

export interface FieldTypeResponse extends express.Response {
  fieldType: FieldTypeResponseDto;
}

export interface FieldTypesResponse extends express.Response {
  fieldTypes: FieldTypeResponseDto[];
}

export interface FieldTypeRequestDto {
  childFieldTypeComponents: FieldTypeComponentRequestDto[];
  childFieldTypeComponentIds: number[];
  name: string;
  parentFieldTypeComponent: FieldTypeComponentRequestDto | null;
  parentFieldTypeComponentId: number | null;
  tagIds: number[];
  valueType: fieldTypeTypeEnum | null;
  validator: string;
}

export interface FieldTypeSearchRequestDto extends Query {
  childFieldTypeComponentIds: string[];
  createdAt?: string;
  ids?: string[];
  limit?: string;
  name?: string;
  offset?: string;
  parentFieldTypeComponentIds: string[];
  tagIds?: string[];
  updatedAt?: string;
  valueType?: string;
  validator?: string;
}

export class FieldTypeResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  childFieldTypeComponents: FieldTypeComponentResponseDto[] = [];
  childFieldTypeComponentIds: number[] = [];
  name: string;
  parentFieldTypeComponent: FieldTypeComponentResponseDto | null = null;
  parentFieldTypeComponentId: number | null = null;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];
  valueType: fieldTypeTypeEnum | null;
  validator: string;

  constructor(fieldType: FieldType) {
    this.id = fieldType.id;
    this.createdAt = fieldType.createdAt.toISOString();
    this.updatedAt = fieldType.updatedAt.toISOString();
    this.name = fieldType.name;
    this.valueType = fieldType.type ?? null;
    this.validator = fieldType.validator ?? "";
  }

  public async loadAssociations(fieldType: FieldType): Promise<void> {
    if (this.id !== fieldType.id) {
      throw new Error("IDs don't match.");
    }

    const childFieldTypeComponents =
      await fieldType.getChildFieldTypeComponents();
    childFieldTypeComponents?.forEach((childFieldTypeComponent) => {
      this.childFieldTypeComponents.push(
        new FieldTypeComponentResponseDto(childFieldTypeComponent)
      );
      this.childFieldTypeComponentIds.push(childFieldTypeComponent.id);
    });

    const parentFieldTypeComponent =
      await fieldType.getParentFieldTypeComponent();
    if (
      parentFieldTypeComponent !== undefined &&
      parentFieldTypeComponent !== null
    ) {
      this.parentFieldTypeComponent = new FieldTypeComponentResponseDto(
        parentFieldTypeComponent
      );
      this.parentFieldTypeComponentId = parentFieldTypeComponent.id;
    }

    const tags = await fieldType.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });
  }
}

export function FieldTypeDtoToModel(
  fieldTypeDto: FieldTypeRequestDto | FieldTypeResponseDto
): FieldType {
  const fieldType = FieldType.build({
    name: fieldTypeDto.name,
    type: fieldTypeDto.valueType ?? undefined,
    validator: fieldTypeDto.validator,
  });
  return fieldType;
}
