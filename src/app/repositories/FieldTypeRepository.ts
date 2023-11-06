import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import FieldType from "../../database/models/FieldType";

export async function getFieldType(
  fieldTypeId: number
): Promise<FieldType | null> {
  const fieldType = await FieldType.findOne({
    where: {
      id: fieldTypeId,
    },
  });
  return fieldType;
}

export async function getFieldTypes(
  fieldTypeWhereOptions: WhereOptions<Attributes<FieldType>>,
  limit: number,
  offset: number
): Promise<FieldType[]> {
  const findOptions: FindOptions = {
    limit,
    offset,
    where: fieldTypeWhereOptions,
  };

  const fieldTypes = await FieldType.findAll(findOptions);

  return fieldTypes;
}

export async function createOrUpdateFieldType(
  fieldTypeModel: FieldType
): Promise<FieldType> {
  const fieldType = await fieldTypeModel.save();
  return fieldType;
}
