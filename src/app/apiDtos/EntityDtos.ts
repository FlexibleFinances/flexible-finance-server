import {
  type FieldDatumRequestDto,
  FieldDatumResponseDto,
} from "./FieldDatumDtos";
import Entity from "../../database/models/Entity";
import { EntityTemplateResponseDto } from "./EntityTemplateDtos";
import { GroupResponseDto } from "./GroupDtos";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import type express from "express";

export interface EntityRequest extends express.Request {
  body: EntityRequestDto;
}

export interface EntitySearchRequest extends express.Request {
  query: EntitySearchRequestDto;
}

export interface EntityResponse extends express.Response {
  entity: EntityResponseDto;
}

export interface EntitiesResponse extends express.Response {
  entities: EntityResponseDto[];
}

export interface EntityRequestDto {
  isTemplate: boolean;
  fieldData: FieldDatumRequestDto[];
  fieldDatumIds: number[];
  name: string;
  parentGroupId: number;
  tagIds: number[];
  templateId: number;
}

export interface EntitySearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  isTemplate?: string;
  name?: string;
  fieldIds?: string[];
  fieldDatumIds?: string[];
  parentGroupIds?: string[];
  tagIds?: string[];
  templateIds?: string[];
}

export class EntityResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  isTemplate: boolean;
  name: string;
  fieldData: FieldDatumResponseDto[] = [];
  fieldDatumIds: number[] = [];
  parentGroup: GroupResponseDto | null = null;
  parentGroupId: number | null = null;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];
  template: EntityTemplateResponseDto | null = null;
  templateId: number;

  constructor(entity: Entity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt.toISOString();
    this.updatedAt = entity.updatedAt.toISOString();
    this.isTemplate = entity.isTemplate;
    this.name = entity.name;
    this.parentGroupId = entity.ParentGroupId ?? null;
    if (entity.TemplateId !== undefined) {
      this.templateId = entity.TemplateId;
    } else {
      throw new Error("Must have a template.");
    }
  }

  public async loadAssociations(entity: Entity): Promise<void> {
    if (this.id !== entity.id) {
      throw new Error("IDs don't match.");
    }

    const fieldData = await entity.getFieldData();
    fieldData?.forEach((fieldDatum) => {
      this.fieldData.push(new FieldDatumResponseDto(fieldDatum));
      this.fieldDatumIds.push(fieldDatum.id);
    });

    if (this.parentGroupId !== null) {
      this.parentGroup = new GroupResponseDto(await entity.getParentGroup());
    }

    const tags = await entity.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });

    const entityTemplate = await entity.getTemplate();
    const entityTemplateDto = new EntityTemplateResponseDto(entityTemplate);
    await entityTemplateDto.loadAssociations(entityTemplate);
    this.template = entityTemplateDto;
  }
}

export function EntityDtoToModel(
  entityDto: EntityRequestDto | EntityResponseDto
): Entity {
  const entity = Entity.build({
    isTemplate: entityDto.isTemplate,
    name: entityDto.name,
    ParentGroupId: entityDto.parentGroupId ?? undefined,
    TemplateId: entityDto.templateId,
  });
  return entity;
}
