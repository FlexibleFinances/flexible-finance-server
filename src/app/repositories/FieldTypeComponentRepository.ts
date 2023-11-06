import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import FieldTypeComponent from "../../database/models/FieldTypeComponent";

export async function getFieldTypeComponent(
  fieldTypeComponentId: number
): Promise<FieldTypeComponent | null> {
  const fieldTypeComponent = await FieldTypeComponent.findOne({
    where: {
      id: fieldTypeComponentId,
    },
  });
  return fieldTypeComponent;
}

export async function getFieldTypeComponents(
  fieldTypeComponentWhereOptions: WhereOptions<Attributes<FieldTypeComponent>>,
  limit: number,
  offset: number
): Promise<FieldTypeComponent[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: fieldTypeComponentWhereOptions,
  };

  const fieldTypeComponents = await FieldTypeComponent.findAll(findOptions);

  return fieldTypeComponents;
}

export async function createOrUpdateFieldTypeComponent(
  fieldTypeComponentModel: FieldTypeComponent
): Promise<FieldTypeComponent> {
  const fieldTypeComponent = await fieldTypeComponentModel.save();
  return fieldTypeComponent;
}

export async function deleteFieldTypeComponents(
  whereOptions: WhereOptions<Attributes<FieldTypeComponent>>
): Promise<void> {
  await FieldTypeComponent.destroy({
    where: whereOptions,
  });
}
