import { type Query } from "express-serve-static-core";
import { RoleResponseDto } from "./RoleDtos";
import User from "../../database/models/User";
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
  email: string;
  password: string;
  roleIds: number[];
  username: string;
}

export interface UserSearchRequestDto extends Query {
  createdAt?: string;
  ids?: string[];
  limit?: string;
  offset?: string;
  roleIds?: string[];
  updatedAt?: string;
  username?: string;
}

export class UserResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  email: string;
  roles: RoleResponseDto[] = [];
  roleIds: number[] = [];
  username: string;

  constructor(user: User) {
    this.id = user.id;
    this.createdAt = user.createdAt.toISOString();
    this.updatedAt = user.updatedAt.toISOString();
    this.email = user.email;
    this.username = user.username;
  }

  public async loadAssociations(user: User): Promise<void> {
    if (this.id !== user.id) {
      throw new Error("IDs don't match.");
    }

    const roles = await user.getRoles();
    roles?.forEach((role) => {
      this.roles.push(new RoleResponseDto(role));
      this.roleIds.push(role.id);
    });
  }
}

export function UserDtoToModel(userDto: UserRequestDto): User {
  const user = User.build({
    email: userDto.email,
    password: userDto.password,
    username: userDto.username,
  });
  return user;
}
