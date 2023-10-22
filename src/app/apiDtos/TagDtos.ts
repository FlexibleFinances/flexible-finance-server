import { type Query } from "express-serve-static-core";
import type Tag from "../../database/models/Tag";
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
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
}

export interface TagSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  name?: string;
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
