import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import Tag from "../../database/models/Tag";

export async function getTag(tagId: number): Promise<Tag | null> {
  const tag = await Tag.findOne({
    where: {
      id: tagId,
    },
  });
  return tag;
}

export async function getTags(
  tagWhereOptions: WhereOptions<Attributes<Tag>>,
  limit: number,
  offset: number
): Promise<Tag[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: tagWhereOptions,
  };

  const tags = await Tag.findAll(findOptions);

  return tags;
}

export async function createOrUpdateTag(tagModel: Tag): Promise<Tag> {
  const tag = await tagModel.save();
  return tag;
}
