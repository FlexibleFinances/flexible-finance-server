import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import Field from "../../database/models/Field";

export async function getField(fieldId: number): Promise<Field | null> {
  const field = await Field.findOne({
    where: {
      id: fieldId,
    },
  });
  return field;
}

export async function getFields(
  fieldWhereOptions: WhereOptions<Attributes<Field>>,
  limit: number,
  offset: number
): Promise<Field[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: fieldWhereOptions,
  };

  const fields = await Field.findAll(findOptions);

  return fields;
}

export async function createOrUpdateField(fieldModel: Field): Promise<Field> {
  const field = await fieldModel.save();
  return field;
}
