import type FieldDatum from "../../database/models/FieldDatum";
import { FieldResponseDto } from "./FieldDtos";
import { type Query } from "express-serve-static-core";
// import type Tag from "../../database/models/Tag";
import { type TagResponseDto } from "./TagDtos";
import type express from "express";

export interface FieldDatumRequest extends express.Request {
  body: FieldDatumRequestDto;
}

export interface FieldDatumSearchRequest extends express.Request {
  query: FieldDatumSearchRequestDto;
}

export interface FieldDatumResponse extends express.Response {
  fieldDatum: FieldDatumResponseDto;
}

export interface FieldDataResponse extends express.Response {
  fieldData: FieldDatumResponseDto[];
}

export interface FieldDatumRequestDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  fieldId: number;
  tagIds?: number[];
}

export interface FieldDatumSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  fieldIds?: string[];
  tagIds?: string[];
}

export class FieldDatumResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  field: FieldResponseDto;
  fieldId: number;
  tags?: TagResponseDto[];
  tagIds?: number[];

  constructor(fieldDatum: FieldDatum) {
    this.id = fieldDatum.id;
    this.createdAt = fieldDatum.createdAt.toISOString();
    this.updatedAt = fieldDatum.updatedAt.toISOString();

    this.field = new FieldResponseDto(fieldDatum.Field);
    this.fieldId = fieldDatum.Field.id;

    //    if (fieldDatum.Tags !== undefined) {
    //      this.tagIds = fieldDatum.Tags.map((tag: Tag) => tag.id);
    //    }
  }
}
