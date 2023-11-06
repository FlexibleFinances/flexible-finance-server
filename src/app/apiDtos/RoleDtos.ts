import { type Query } from "express-serve-static-core";
import Role from "../../database/models/Role";
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
  name: string;
  userIds: number[];
}

export interface RoleSearchRequestDto extends Query {
  createdAt?: string;
  ids?: string[];
  limit?: string;
  name?: string;
  offset?: string;
  updatedAt?: string;
  userIds?: string[];
}

export class RoleResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  users: UserResponseDto[] = [];
  userIds: number[] = [];

  constructor(role: Role) {
    this.id = role.id;
    this.createdAt = role.createdAt.toISOString();
    this.updatedAt = role.updatedAt.toISOString();
    this.name = role.name;
  }

  public async loadAssociations(role: Role): Promise<void> {
    if (this.id !== role.id) {
      throw new Error("IDs don't match.");
    }

    const users = await role.getUsers();
    users?.forEach((user) => {
      this.users.push(new UserResponseDto(user));
      this.userIds.push(user.id);
    });
  }
}

export function RoleDtoToModel(
  roleDto: RoleRequestDto | RoleResponseDto
): Role {
  const role = Role.build({
    name: roleDto.name,
  });
  return role;
}
