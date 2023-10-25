import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type FieldRequestDto,
  type FieldSearchRequestDto,
} from "../apiDtos/FieldDtos";
import Field from "../../database/models/Field";
import { defaultLimit } from "../../utils/constants";

export async function getFieldById(fieldId: number): Promise<Field | null> {
  const field = await Field.findOne({
    where: {
      id: fieldId,
    },
    include: { all: true },
  });
  return field;
}

export async function getFieldsByOptions(
  fieldOptions: FieldSearchRequestDto
): Promise<Field[] | null> {
  const whereOptions: WhereOptions = {};
  if (fieldOptions.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: fieldOptions.name,
    };
  }
  if (fieldOptions.tagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: fieldOptions.tagIds.map((id) => +id),
    };
  }

  const findOptions: FindOptions = {
    offset: +(fieldOptions.offset ?? 0),
    limit: +(fieldOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: { all: true },
  };

  const fields = await Field.findAll(findOptions);

  return fields;
}

export async function createFieldFromDto(
  fieldDto: FieldRequestDto
): Promise<Field | null> {
  const createOptions: CreationAttributes<Field> = {
    name: fieldDto.name ?? "",
    FieldTypeId: fieldDto.fieldTypeId,
  };

  const field = await Field.create(createOptions);

  if (fieldDto.tagIds !== undefined) {
    await field.setTags(fieldDto.tagIds);
  }

  await field.loadAssociatedIds();

  return field;
}

export async function updateFieldFromDto(
  id: number,
  fieldDto: FieldRequestDto
): Promise<Field | null> {
  const field = await Field.findOne({
    where: {
      id,
    },
  });
  if (field === null) {
    return null;
  }
  const updateOptions: CreationAttributes<Field> = {
    name: fieldDto.name ?? "",
    FieldTypeId: fieldDto.fieldTypeId,
  };
  await field.update(updateOptions);

  if (fieldDto.tagIds !== undefined) {
    await field.setTags(fieldDto.tagIds);
  }

  await field.loadAssociatedIds();

  return field;
}
