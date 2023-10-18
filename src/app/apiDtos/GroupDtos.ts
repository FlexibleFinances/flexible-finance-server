import type Group from "../../database/models/Group";

export class GroupResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  parentGroupId?: number;
  accountIds?: number[];
  entityIds?: number[];
  groupIds?: number[];

  constructor(group: Group) {
    this.id = group.id;
    this.createdAt = group.createdAt.toISOString();
    this.updatedAt = group.updatedAt.toISOString();
    this.name = group.name;
    this.parentGroupId = group.GroupId;
    this.accountIds = group.AccountIds;
    this.entityIds = group.EntityIds;
  }
}
