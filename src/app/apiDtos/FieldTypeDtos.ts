import type FieldType from "../../database/models/FieldType";
import { type Query } from "express-serve-static-core";
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
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  type?: fieldTypeTypeEnum;
  validator?: string;
}

export interface FieldTypeSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  type?: string;
  validator?: string;
}

export class FieldTypeResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  type?: fieldTypeTypeEnum;
  validator?: string;

  constructor(fieldType: FieldType) {
    this.id = fieldType.id;
    this.createdAt = fieldType.createdAt.toISOString();
    this.updatedAt = fieldType.updatedAt.toISOString();
    this.name = fieldType.name;
    this.type = fieldType.type;
    this.validator = fieldType.validator;
  }
}
