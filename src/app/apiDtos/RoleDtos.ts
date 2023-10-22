import { type Query } from "express-serve-static-core";
import type Role from "../../database/models/Role";
import { UserResponseDto } from "./UserDtos";
import type express from "express";

export interface RoleRequest extends express.Request {
  body: RoleRequestDto;
}

export interface RoleSearchRequest extends express.Request {
  query: RoleSearchRequestDto;
}

export interface RoleResponse extends express.Response {
  role: RoleResponseDto;
}

export interface RolesResponse extends express.Response {
  roles: RoleResponseDto[];
}

export interface RoleRequestDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  userIds?: number[];
}

export interface RoleSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  userIds?: string[];
}

export class RoleResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  users: UserResponseDto[];
  userIds: number[];

  constructor(role: Role) {
    this.id = role.id;
    this.createdAt = role.createdAt.toISOString();
    this.updatedAt = role.updatedAt.toISOString();
    this.name = role.name;
    this.users = role.Users?.map((user) => new UserResponseDto(user));
    this.userIds = role.Users?.map((user) => user.id);
  }
}
