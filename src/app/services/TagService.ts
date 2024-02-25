import * as TagRepository from "../repositories/TagRepository";
import { type Attributes, Op, type WhereOptions } from "sequelize";
import {
  TagDtoToModel,
  type TagRequestDto,
  type TagSearchRequestDto,
} from "../apiDtos/TagDtos";
import type Tag from "../../database/models/Tag";
import { defaultLimit } from "../../utils/constants";

export async function getTag(tagId: number): Promise<Tag | null> {
  const tag = await TagRepository.getTag(tagId);
  return tag;
}

export async function getTags(
  tagSearchDto: TagSearchRequestDto
): Promise<Tag[]> {
  const whereOptions: WhereOptions<Attributes<Tag>> = {};
  if (tagSearchDto.accountIds != null) {
    whereOptions.AccountIds = {
      [Op.overlap]: tagSearchDto.accountIds.map((id) => +id),
    };
  }
  if (tagSearchDto.entityIds != null) {
    whereOptions.EntityIds = {
      [Op.overlap]: tagSearchDto.entityIds.map((id) => +id),
    };
  }
  if (tagSearchDto.fieldIds != null) {
    whereOptions.FieldIds = {
      [Op.overlap]: tagSearchDto.fieldIds.map((id) => +id),
    };
  }
  if (tagSearchDto.fieldTypeIds != null) {
    whereOptions.FieldTypeIds = {
      [Op.overlap]: tagSearchDto.fieldTypeIds.map((id) => +id),
    };
  }
  if (tagSearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: tagSearchDto.name,
    };
  }
  if (tagSearchDto.transactionIds != null) {
    whereOptions.TransactionIds = {
      [Op.overlap]: tagSearchDto.transactionIds.map((id) => +id),
    };
  }

  const searchLimit =
    tagSearchDto.limit != null ? +tagSearchDto.limit : defaultLimit;
  const searchOffset = tagSearchDto.offset != null ? +tagSearchDto.offset : 0;

  const tags = await TagRepository.getTags(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return tags;
}

export async function createTagFromDto(tagDto: TagRequestDto): Promise<Tag> {
  const tagModel = TagDtoToModel(tagDto);
  const tag = await TagRepository.createOrUpdateTag(tagModel);

  return tag;
}

export async function updateTagFromDto(
  id: number,
  tagDto: TagRequestDto
): Promise<Tag | null> {
  const tagModel = await getTag(id);
  if (tagModel == null) {
    return null;
  }

  tagModel.set({
    name: tagDto.name,
  });

  const tag = await TagRepository.createOrUpdateTag(tagModel);

  return tag;
}
