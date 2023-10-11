import type Role from "../../database/models/Role";

export class RoleResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  userIds?: number[];

  constructor(role: Role) {
    this.id = role.id;
    this.createdAt = role.createdAt.toISOString();
    this.updatedAt = role.updatedAt.toISOString();
    this.name = role.name;
    this.userIds = role.UserIds;
  }
}
