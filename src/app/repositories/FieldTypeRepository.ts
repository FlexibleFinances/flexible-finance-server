import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type FieldTypeRequestDto,
  type FieldTypeSearchRequestDto,
} from "../apiDtos/FieldTypeDtos";
import FieldType from "../../database/models/FieldType";
import { defaultLimit } from "../../utils/constants";

export async function getFieldTypeById(
  fieldTypeId: number
): Promise<FieldType | null> {
  const fieldType = await FieldType.findOne({
    where: {
      id: fieldTypeId,
    },
    include: { all: true },
  });
  return fieldType;
}

export async function getFieldTypesByOptions(
  fieldTypeOptions: FieldTypeSearchRequestDto
): Promise<FieldType[] | null> {
  const whereOptions: WhereOptions = {};
  if (fieldTypeOptions.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: fieldTypeOptions.name,
    };
  }

  const findOptions: FindOptions = {
    offset: +(fieldTypeOptions.offset ?? 0),
    limit: +(fieldTypeOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: { all: true },
  };

  const fieldTypes = await FieldType.findAll(findOptions);

  return fieldTypes;
}

export async function createFieldTypeFromDto(
  fieldTypeDto: FieldTypeRequestDto
): Promise<FieldType | null> {
  const createOptions: CreationAttributes<FieldType> = {
    name: fieldTypeDto.name ?? "",
  };
  const fieldType = await FieldType.create(createOptions);

  return fieldType;
}

export async function updateFieldTypeFromDto(
  fieldTypeDto: FieldTypeRequestDto
): Promise<FieldType | null> {
  const fieldType = await FieldType.findOne({
    where: {
      id: fieldTypeDto.id,
    },
  });
  if (fieldType === null) {
    return null;
  }
  const updateOptions: CreationAttributes<FieldType> = {
    name: fieldTypeDto.name ?? "",
  };
  await fieldType.update(updateOptions);

  return fieldType;
}
