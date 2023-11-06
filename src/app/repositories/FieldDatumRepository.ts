import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import FieldDatum from "../../database/models/FieldDatum";

export async function getFieldDatum(
  fieldDatumId: number
): Promise<FieldDatum | null> {
  const fieldDatum = await FieldDatum.findOne({
    where: {
      id: fieldDatumId,
    },
  });
  return fieldDatum;
}

export async function getFieldData(
  fieldDatumWhereOptions: WhereOptions<Attributes<FieldDatum>>,
  limit: number,
  offset: number
): Promise<FieldDatum[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: fieldDatumWhereOptions,
  };

  const fieldData = await FieldDatum.findAll(findOptions);

  return fieldData;
}

export async function createOrUpdateFieldDatum(
  fieldDatumModel: FieldDatum
): Promise<FieldDatum> {
  const fieldDatum = await fieldDatumModel.save();
  return fieldDatum;
}

export async function deleteFieldData(
  whereOptions: WhereOptions<Attributes<FieldDatum>>
): Promise<void> {
  await FieldDatum.destroy({
    where: whereOptions,
  });
}
