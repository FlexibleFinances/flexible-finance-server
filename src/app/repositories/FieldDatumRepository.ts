import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type FieldDatumRequestDto,
  type FieldDatumSearchRequestDto,
} from "../apiDtos/FieldDatumDtos";
import FieldDatum from "../../database/models/FieldDatum";
import { defaultLimit } from "../../utils/constants";

export async function getFieldDatumById(
  fieldDatumId: number
): Promise<FieldDatum | null> {
  const fieldDatum = await FieldDatum.findOne({
    where: {
      id: fieldDatumId,
    },
    include: { all: true },
  });
  return fieldDatum;
}

export async function getFieldDataByOptions(
  fieldDatumOptions: FieldDatumSearchRequestDto
): Promise<FieldDatum[] | null> {
  const whereOptions: WhereOptions = {};
  if (fieldDatumOptions.tagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: fieldDatumOptions.tagIds.map((id) => +id),
    };
  }

  const findOptions: FindOptions = {
    offset: +(fieldDatumOptions.offset ?? 0),
    limit: +(fieldDatumOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: { all: true },
  };

  const fieldData = await FieldDatum.findAll(findOptions);

  return fieldData;
}

export async function createFieldDatumFromDto(
  fieldDatumDto: FieldDatumRequestDto
): Promise<FieldDatum | null> {
  const createOptions: CreationAttributes<FieldDatum> = {
    FieldId: fieldDatumDto.fieldId,
  };
  const fieldDatum = await FieldDatum.create(createOptions);

  return fieldDatum;
}

export async function updateFieldDatumFromDto(
  id: number,
  fieldDatumDto: FieldDatumRequestDto
): Promise<FieldDatum | null> {
  const fieldDatum = await FieldDatum.findOne({
    where: {
      id,
    },
  });
  if (fieldDatum === null) {
    return null;
  }
  const updateOptions: CreationAttributes<FieldDatum> = {
    FieldId: fieldDatumDto.fieldId,
  };
  await fieldDatum.update(updateOptions);

  return fieldDatum;
}
