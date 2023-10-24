import type Field from "../../database/models/Field";
import { FieldTypeResponseDto } from "./FieldTypeDtos";
import { type Query } from "express-serve-static-core";
// import type Tag from "../../database/models/Tag";
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
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  fieldTypeId: number;
  tagIds?: number[];
}

export interface FieldSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  fieldTypeIds?: string[];
  tagIds?: string[];
}

export class FieldResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  fieldType: FieldTypeResponseDto;
  fieldTypeId: number;
  tags?: TagResponseDto[];
  tagIds?: number[];

  constructor(field: Field) {
    this.id = field.id;
    this.createdAt = field.createdAt.toISOString();
    this.updatedAt = field.updatedAt.toISOString();
    this.name = field.name;
    this.fieldType = new FieldTypeResponseDto(field.FieldType);
    this.fieldTypeId = field.FieldType.id;
    this.tags = field.Tags?.map((tag) => new TagResponseDto(tag));
    this.tagIds = field.Tags?.map((tag) => tag.id);
  }
}
