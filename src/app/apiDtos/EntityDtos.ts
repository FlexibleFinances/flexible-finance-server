import type Entity from "../../database/models/Entity";
import type Field from "../../database/models/Field";
import type FieldDatum from "../../database/models/FieldDatum";
import { type FieldValue } from "../../database/models/FieldDatum";
import { GroupResponseDto } from "./GroupDtos";
import { type Query } from "express-serve-static-core";
import type Tag from "../../database/models/Tag";
import { type TagResponseDto } from "./TagDtos";
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
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  fieldValues?: FieldValue[];
  parentGroupId?: number;
  tagIds?: number[];
  templateId?: number;
  isTemplate?: boolean;
}

export interface EntitySearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  fieldDatumIds?: string[];
  fieldIds?: string[];
  fieldValues?: undefined;
  parentGroupIds?: string[];
  tagIds?: string[];
  templateIds?: string[];
  isTemplate?: string;
}

export class EntityResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  fieldValues?: FieldValue[];
  parentGroup?: GroupResponseDto;
  parentGroupId?: number;
  tags?: TagResponseDto[];
  tagIds?: number[];
  template?: EntityResponseDto;
  templateId?: number;
  isTemplate: boolean;

  constructor(entity: Entity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt.toISOString();
    this.updatedAt = entity.updatedAt.toISOString();
    this.name = entity.name;
    this.parentGroup = new GroupResponseDto(entity.Group);
    this.parentGroupId = entity.Group?.id;
    this.templateId = entity.TemplateId;
    this.isTemplate = entity.isTemplate;

    if (entity.isTemplate) {
      if (entity.Fields !== undefined) {
        this.fieldIds = entity.Fields.map((field: Field) => field.id);
      }
    } else {
      if (entity.FieldData !== undefined) {
        this.fieldDatumIds = entity.FieldData.map(
          (fieldDatum: FieldDatum) => fieldDatum.id
        );
      }
    }
    if (entity.Tags !== undefined) {
      this.tagIds = entity.Tags.map((tag: Tag) => tag.id);
    }
  }
}
