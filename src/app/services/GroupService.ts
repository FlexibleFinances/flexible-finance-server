import * as GroupRepository from "../repositories/GroupRepository";
import { type Attributes, Op, type WhereOptions } from "sequelize";
import {
  GroupDtoToModel,
  type GroupRequestDto,
  type GroupSearchRequestDto,
} from "../apiDtos/GroupDtos";
import type Group from "../../database/models/Group";
import { defaultLimit } from "../../utils/constants";

export async function getGroup(groupId: number): Promise<Group | null> {
  const group = await GroupRepository.getGroup(groupId);
  return group;
}

export async function getGroups(
  groupSearchDto: GroupSearchRequestDto
): Promise<Group[]> {
  const whereOptions: WhereOptions<Attributes<Group>> = {};
  if (groupSearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: groupSearchDto.name,
    };
  }
  if (groupSearchDto.parentGroupIds != null) {
    whereOptions.ParentGroupId = {
      [Op.in]: groupSearchDto.parentGroupIds.map((id) => +id),
    };
  }
  if (groupSearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: groupSearchDto.tagIds.map((id) => +id),
    };
  }

  const searchLimit =
    groupSearchDto.limit != null ? +groupSearchDto.limit : defaultLimit;
  const searchOffset =
    groupSearchDto.offset != null ? +groupSearchDto.offset : 0;

  const groups = await GroupRepository.getGroups(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return groups;
}

export async function createGroupFromDto(
  groupDto: GroupRequestDto
): Promise<Group> {
  const groupModel = GroupDtoToModel(groupDto);
  const group = await GroupRepository.createOrUpdateGroup(groupModel);

  await group.setAccounts(groupDto.accountIds);
  await group.setChildGroups(groupDto.childGroupIds);
  await group.setEntities(group.EntityIds);
  await group.setTags(groupDto.tagIds);

  return group;
}

export async function updateGroupFromDto(
  id: number,
  groupDto: GroupRequestDto
): Promise<Group | null> {
  const groupModel = await getGroup(id);
  if (groupModel == null) {
    return null;
  }

  groupModel.set({
    name: groupDto.name,
    ParentGroupId: groupDto.parentGroupId ?? undefined,
  });

  const group = await GroupRepository.createOrUpdateGroup(groupModel);

  await group.setAccounts(groupDto.accountIds);
  await group.setChildGroups(groupDto.childGroupIds);
  await group.setEntities(group.EntityIds);
  await group.setTags(groupDto.tagIds);

  return group;
}
