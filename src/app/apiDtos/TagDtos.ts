import { type Query } from "express-serve-static-core";
import Tag from "../../database/models/Tag";
import type express from "express";

export interface TagRequest extends express.Request {
  body: TagRequestDto;
}

export interface TagSearchRequest extends express.Request {
  query: TagSearchRequestDto;
}

export interface TagResponse extends express.Response {
  tag: TagResponseDto;
}

export interface TagsResponse extends express.Response {
  tags: TagResponseDto[];
}

export interface TagRequestDto {
  name: string;
}

export interface TagSearchRequestDto extends Query {
  accountIds?: string[];
  createdAt?: string;
  entityIds?: string[];
  fieldIds?: string[];
  fieldTypeIds?: string[];
  ids?: string[];
  limit?: string;
  name?: string;
  offset?: string;
  transactionIds?: string[];
  updatedAt?: string;
}

export class TagResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.createdAt = tag.createdAt.toISOString();
    this.updatedAt = tag.updatedAt.toISOString();
    this.name = tag.name;
  }
}

export function TagDtoToModel(tagDto: TagRequestDto | TagResponseDto): Tag {
  const tag = Tag.build({
    name: tagDto.name,
  });
  return tag;
}
