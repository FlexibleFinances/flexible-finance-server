import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import FieldComponent from "../../database/models/FieldComponent";

export async function getFieldComponent(
  fieldComponentId: number
): Promise<FieldComponent | null> {
  const fieldComponent = await FieldComponent.findOne({
    where: {
      id: fieldComponentId,
    },
  });
  return fieldComponent;
}

export async function getFieldComponents(
  fieldComponentWhereOptions: WhereOptions<Attributes<FieldComponent>>,
  limit: number,
  offset: number
): Promise<FieldComponent[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: fieldComponentWhereOptions,
  };

  const fieldComponents = await FieldComponent.findAll(findOptions);

  return fieldComponents;
}

export async function createOrUpdateFieldComponent(
  fieldComponentModel: FieldComponent
): Promise<FieldComponent> {
  const fieldComponent = await fieldComponentModel.save();
  return fieldComponent;
}

export async function deleteFieldComponents(
  whereOptions: WhereOptions<Attributes<FieldComponent>>
): Promise<void> {
  await FieldComponent.destroy({
    where: whereOptions,
  });
}
