import type Group from "../../database/models/Group";
import { type Query } from "express-serve-static-core";
import { TagResponseDto } from "./TagDtos";
import type express from "express";

export interface GroupRequest extends express.Request {
  body: GroupRequestDto;
}

export interface GroupSearchRequest extends express.Request {
  query: GroupSearchRequestDto;
}

export interface GroupResponse extends express.Response {
  group: GroupResponseDto;
}

export interface GroupsResponse extends express.Response {
  groups: GroupResponseDto[];
}

export interface GroupRequestDto {
  name?: string;
  parentGroupId?: number;
  tagIds?: number[];
}

export interface GroupSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  parentGroupIds?: string[];
  tagIds?: string[];
}

export class GroupResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  parentGroup?: GroupResponseDto;
  parentGroupId?: number;
  tags?: TagResponseDto[];
  tagIds?: number[];

  constructor(group: Group) {
    this.id = group.id;
    this.createdAt = group.createdAt.toISOString();
    this.updatedAt = group.updatedAt.toISOString();
    this.name = group.name;
    this.parentGroupId = group.GroupId;
    this.tags = group.Tags?.map((tag) => new TagResponseDto(tag));
    this.tagIds = group.Tags?.map((tag) => tag.id);
  }
}
