import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import Group from "../../database/models/Group";

export async function getGroup(groupId: number): Promise<Group | null> {
  const group = await Group.findOne({
    where: {
      id: groupId,
    },
  });
  return group;
}

export async function getGroups(
  groupWhereOptions: WhereOptions<Attributes<Group>>,
  limit: number,
  offset: number
): Promise<Group[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: groupWhereOptions,
  };

  const groups = await Group.findAll(findOptions);

  return groups;
}

export async function createOrUpdateGroup(groupModel: Group): Promise<Group> {
  const group = await groupModel.save();
  return group;
}
