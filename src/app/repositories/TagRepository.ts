import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type TagRequestDto,
  type TagSearchRequestDto,
} from "../apiDtos/TagDtos";
import Tag from "../../database/models/Tag";
import { defaultLimit } from "../../utils/constants";

export async function getTagById(tagId: number): Promise<Tag | null> {
  const tag = await Tag.findOne({
    where: {
      id: tagId,
    },
    include: { all: true },
  });
  return tag;
}

export async function getTagsByOptions(
  tagOptions: TagSearchRequestDto
): Promise<Tag[] | null> {
  const whereOptions: WhereOptions = {};
  if (tagOptions.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: tagOptions.name,
    };
  }

  const findOptions: FindOptions = {
    offset: +(tagOptions.offset ?? 0),
    limit: +(tagOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: { all: true },
  };

  const tags = await Tag.findAll(findOptions);

  return tags;
}

export async function createTagFromDto(
  tagDto: TagRequestDto
): Promise<Tag | null> {
  const createOptions: CreationAttributes<Tag> = {
    name: tagDto.name ?? "",
  };
  const tag = await Tag.create(createOptions);

  return tag;
}

export async function updateTagFromDto(
  tagDto: TagRequestDto
): Promise<Tag | null> {
  const tag = await Tag.findOne({
    where: {
      id: tagDto.id,
    },
  });
  if (tag === null) {
    return null;
  }
  const updateOptions: CreationAttributes<Tag> = {
    name: tagDto.name ?? "",
  };
  await tag.update(updateOptions);

  return tag;
}
