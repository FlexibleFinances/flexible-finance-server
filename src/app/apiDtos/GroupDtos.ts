import { AccountResponseDto } from "./AccountDtos";
import { EntityResponseDto } from "./EntityDtos";
import Group from "../../database/models/Group";
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
  accountIds: number[];
  childGroupIds: number[];
  entityIds: number[];
  name: string;
  parentGroupId: number | null;
  tagIds: number[];
}

export interface GroupSearchRequestDto extends Query {
  accountIds?: string[];
  childGroupIds?: string[];
  createdAt?: string;
  entityIds?: string[];
  ids?: string[];
  limit?: string;
  name?: string;
  offset?: string;
  parentGroupIds?: string[];
  tagIds?: string[];
  updatedAt?: string;
}

export class GroupResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  accounts: AccountResponseDto[] = [];
  accountIds: number[] = [];
  childGroups: GroupResponseDto[] = [];
  childGroupIds: number[] = [];
  entities: EntityResponseDto[] = [];
  entityIds: number[] = [];
  name: string;
  parentGroup: GroupResponseDto | null = null;
  parentGroupId: number | null = null;
  tags: TagResponseDto[] = [];
  tagIds: number[] = [];

  constructor(group: Group) {
    this.id = group.id;
    this.createdAt = group.createdAt.toISOString();
    this.updatedAt = group.updatedAt.toISOString();
    this.name = group.name;
    this.parentGroupId = group.ParentGroupId ?? null;
  }

  public async loadAssociations(group: Group): Promise<void> {
    if (this.id !== group.id) {
      throw new Error("IDs don't match.");
    }

    const accounts = await group.getAccounts();
    accounts?.forEach((account) => {
      this.accounts.push(new AccountResponseDto(account));
      this.accountIds.push(account.id);
    });

    const childGroups = await group.getChildGroups();
    childGroups?.forEach((childGroup) => {
      this.childGroups.push(new GroupResponseDto(childGroup));
      this.childGroupIds.push(childGroup.id);
    });

    const entities = await group.getEntities();
    entities?.forEach((entity) => {
      this.entities.push(new EntityResponseDto(entity));
      this.entityIds.push(entity.id);
    });

    if (this.parentGroupId != null) {
      this.parentGroup = new GroupResponseDto(await group.getParentGroup());
    }

    const tags = await group.getTags();
    tags?.forEach((tag) => {
      this.tags.push(new TagResponseDto(tag));
      this.tagIds.push(tag.id);
    });
  }
}

export function GroupDtoToModel(
  groupDto: GroupRequestDto | GroupResponseDto
): Group {
  const group = Group.build({
    ParentGroupId: groupDto.parentGroupId ?? undefined,
    name: groupDto.name,
  });
  return group;
}
