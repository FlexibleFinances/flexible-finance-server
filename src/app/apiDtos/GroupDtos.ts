import type Account from "../../database/models/Account";
import { AccountResponseDto } from "./AccountDtos";
import type Entity from "../../database/models/Entity";
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
    const accountPromises: Array<Promise<void>> = [];
    accounts?.forEach((account) => {
      async function associatedDtoPromise(
        groupDto: GroupResponseDto,
        account: Account
      ): Promise<void> {
        const accountDto = new AccountResponseDto(account);
        await accountDto.loadAssociations(account);
        groupDto.accounts.push(accountDto);
        groupDto.accountIds.push(account.id);
      }
      accountPromises.push(associatedDtoPromise(this, account));
    });
    await Promise.all(accountPromises);

    const childGroups = await group.getChildGroups();
    const childGroupPromises: Array<Promise<void>> = [];
    childGroups?.forEach((childGroup) => {
      async function associatedDtoPromise(
        groupDto: GroupResponseDto,
        childGroup: Group
      ): Promise<void> {
        const childGroupDto = new GroupResponseDto(childGroup);
        await childGroupDto.loadAssociations(childGroup);
        groupDto.childGroups.push(childGroupDto);
        groupDto.childGroupIds.push(childGroup.id);
      }
      accountPromises.push(associatedDtoPromise(this, childGroup));
    });
    await Promise.all(childGroupPromises);

    const entities = await group.getEntities();
    const entityPromises: Array<Promise<void>> = [];
    entities?.forEach((entity) => {
      async function associatedDtoPromise(
        groupDto: GroupResponseDto,
        entity: Entity
      ): Promise<void> {
        const entityDto = new EntityResponseDto(entity);
        await entityDto.loadAssociations(entity);
        groupDto.entities.push(entityDto);
        groupDto.entityIds.push(entity.id);
      }
      accountPromises.push(associatedDtoPromise(this, entity));
    });
    await Promise.all(entityPromises);

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
