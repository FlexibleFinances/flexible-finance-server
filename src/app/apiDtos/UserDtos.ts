import type User from "../../database/models/User";

export class UserResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  username: string;
  email: string;
  roleIds?: number[];

  constructor(user: User) {
    this.id = user.id;
    this.createdAt = user.createdAt.toISOString();
    this.updatedAt = user.updatedAt.toISOString();
    this.username = user.username;
    this.email = user.email;
    this.roleIds = user.RoleIds;
  }
}
