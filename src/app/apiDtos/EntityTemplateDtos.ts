import {
  type FieldDatumRequestDto,
  FieldDatumResponseDto,
} from "./FieldDatumDtos";
import Entity from "../../database/models/Entity";
import { FieldResponseDto } from "./FieldDtos";
import { GroupResponseDto } from "./GroupDtos";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import type express from "express";

export interface EntityTemplateRequest extends express.Request {
  body: EntityTemplateRequestDto;
}

export interface EntityTemplateSearchRequest extends express.Request {
  query: EntityTemplateSearchRequestDto;
}

export interface EntityTemplateResponse extends express.Response {
  entityTemplate: EntityTemplateResponseDto;
}

export interface EntityTemplatesResponse extends express.Response {
  entityTemplates: EntityTemplateResponseDto[];
}

export interface EntityTemplateRequestDto {
  fieldIds: number[];
  fieldData?: FieldDatumRequestDto[];
  fieldDatumIds?: number[];
  isTemplate: boolean;
  name: string;
  parentGroupId: number;
  tagIds: number[];
}

export interface EntityTemplateSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  fieldIds?: string[];
  fieldDatumIds?: string[];
  isTemplate?: string;
  name?: string;
  parentGroupIds?: string[];
  tagIds?: string[];
}

export class EntityTemplateResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  fields: FieldResponseDto[] = [];
  fieldIds: number[] = [];
  fieldData: FieldDatumResponseDto[] = [];
  fieldDatumIds: number[] = [];
  isTemplate: boolean;
  name: string;
  parentGroup: GroupResponseDto | null = null;
  parentGroupId: number | null = null;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];

  constructor(entityTemplate: Entity) {
    this.id = entityTemplate.id;
    this.createdAt = entityTemplate.createdAt.toISOString();
    this.updatedAt = entityTemplate.updatedAt.toISOString();
    this.isTemplate = entityTemplate.isTemplate;
    this.name = entityTemplate.name;
    this.parentGroupId = entityTemplate.ParentGroupId ?? null;
  }

  public async loadAssociations(entityTemplate: Entity): Promise<void> {
    if (this.id !== entityTemplate.id) {
      throw new Error("IDs don't match.");
    }

    const fields = await entityTemplate.getFields();
    const fieldDtoPromises = fields?.map(async (field) => {
      const fieldDto = new FieldResponseDto(field);
      await fieldDto.loadAssociations(field);
      this.fields.push(fieldDto);
      this.fieldIds.push(field.id);
    });
    await Promise.all(fieldDtoPromises);

    const fieldData = await entityTemplate.getFieldData();
    fieldData?.forEach((fieldDatum) => {
      this.fieldData.push(new FieldDatumResponseDto(fieldDatum));
      this.fieldDatumIds.push(fieldDatum.id);
    });

    if (this.parentGroupId != null) {
      this.parentGroup = new GroupResponseDto(
        await entityTemplate.getParentGroup()
      );
    }

    const tags = await entityTemplate.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });
  }
}

export function EntityTemplateDtoToModel(
  entityDto: EntityTemplateRequestDto | EntityTemplateResponseDto
): Entity {
  const entity = Entity.build({
    isTemplate: entityDto.isTemplate,
    name: entityDto.name,
    ParentGroupId: entityDto.parentGroupId ?? undefined,
  });
  return entity;
}
