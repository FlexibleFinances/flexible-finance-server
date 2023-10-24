import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type GroupRequestDto,
  type GroupSearchRequestDto,
} from "../apiDtos/GroupDtos";
import Group from "../../database/models/Group";
import { defaultLimit } from "../../utils/constants";

export async function getGroupById(groupId: number): Promise<Group | null> {
  const group = await Group.findOne({
    where: {
      id: groupId,
    },
    include: { all: true },
  });
  return group;
}

export async function getGroupsByOptions(
  groupOptions: GroupSearchRequestDto
): Promise<Group[] | null> {
  const whereOptions: WhereOptions = {};
  if (groupOptions.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: groupOptions.name,
    };
  }
  if (groupOptions.parentGroupIds !== undefined) {
    whereOptions.group = {
      [Op.in]: groupOptions.parentGroupIds.map((id) => +id),
    };
  }
  if (groupOptions.tagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: groupOptions.tagIds.map((id) => +id),
    };
  }

  const findOptions: FindOptions = {
    offset: +(groupOptions.offset ?? 0),
    limit: +(groupOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: { all: true },
  };

  const groups = await Group.findAll(findOptions);

  return groups;
}

export async function createGroupFromDto(
  groupDto: GroupRequestDto
): Promise<Group | null> {
  const createOptions: CreationAttributes<Group> = {
    name: groupDto.name ?? "",
    GroupId: groupDto.parentGroupId,
  };
  const group = await Group.create(createOptions);

  if (groupDto.tagIds !== undefined) {
    await group.setTags(groupDto.tagIds);
  }

  await group.loadAssociatedIds();

  return group;
}

export async function updateGroupFromDto(
  groupDto: GroupRequestDto
): Promise<Group | null> {
  const group = await Group.findOne({
    where: {
      id: groupDto.id,
    },
  });
  if (group === null) {
    return null;
  }
  const updateOptions: CreationAttributes<Group> = {
    name: groupDto.name ?? "",
    GroupId: groupDto.parentGroupId,
  };
  await group.update(updateOptions);

  if (groupDto.tagIds !== undefined) {
    await group.setTags(groupDto.tagIds);
  }

  await group.loadAssociatedIds();

  return group;
}
