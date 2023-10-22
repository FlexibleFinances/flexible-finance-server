import { type Query } from "express-serve-static-core";
import type Role from "../../database/models/Role";
import { RoleResponseDto } from "./RoleDtos";
import type User from "../../database/models/User";
import type express from "express";

export interface UserRequest extends express.Request {
  body: UserRequestDto;
}

export interface UserSearchRequest extends express.Request {
  query: UserSearchRequestDto;
}

export interface UserResponse extends express.Response {
  user: UserResponseDto;
}

export interface UsersResponse extends express.Response {
  users: UserResponseDto[];
}

export interface UserRequestDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  email?: string;
  password?: string;
  roleIds: number[];
}

export interface UserSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  email?: string;
  roleIds: string[];
}

export class UserResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  username: string;
  email: string;
  roles?: RoleResponseDto[];
  roleIds?: number[];

  constructor(user: User) {
    this.id = user.id;
    this.createdAt = user.createdAt.toISOString();
    this.updatedAt = user.updatedAt.toISOString();
    this.username = user.username;
    this.email = user.email;
    this.roles = user.Roles?.map((role) => new RoleResponseDto(role));
    this.roleIds = user.Roles?.map((role: Role) => role.id);
  }
}
