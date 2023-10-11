import type Group from "../../database/models/Group";

export class GroupResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  accountIds?: number[];
  entityIds?: number[];
  groupIds?: number[];
  parentGroupId?: number;

  constructor(group: Group) {
    this.id = group.id;
    this.createdAt = group.createdAt.toISOString();
    this.updatedAt = group.updatedAt.toISOString();
    this.name = group.name;
    this.accountIds = group.AccountIds;
    this.entityIds = group.EntityIds;
  }
}
