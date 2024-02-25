import * as FieldComponentRepository from "../repositories/FieldComponentRepository";
import { type Attributes, type WhereOptions } from "sequelize";
import {
  FieldComponentDtoToModel,
  type FieldComponentRequestDto,
  type FieldComponentSearchRequestDto,
} from "../apiDtos/FieldComponentDtos";
import type FieldComponent from "../../database/models/FieldComponent";
import { defaultLimit } from "../../utils/constants";

export async function getFieldComponent(
  fieldComponentId: number
): Promise<FieldComponent | null> {
  const fieldComponent = await FieldComponentRepository.getFieldComponent(
    fieldComponentId
  );
  return fieldComponent;
}

export async function getFieldComponents(
  fieldComponentSearchDto: FieldComponentSearchRequestDto
): Promise<FieldComponent[]> {
  const whereOptions: WhereOptions<Attributes<FieldComponent>> = {};

  const searchLimit =
    fieldComponentSearchDto.limit != null
      ? +fieldComponentSearchDto.limit
      : defaultLimit;
  const searchOffset =
    fieldComponentSearchDto.offset != null
      ? +fieldComponentSearchDto.offset
      : 0;

  const fieldComponents = await FieldComponentRepository.getFieldComponents(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return fieldComponents;
}

export async function createFieldComponentFromDto(
  fieldComponentDto: FieldComponentRequestDto
): Promise<FieldComponent> {
  const fieldComponentModel = FieldComponentDtoToModel(fieldComponentDto);
  const fieldComponent =
    await FieldComponentRepository.createOrUpdateFieldComponent(
      fieldComponentModel
    );

  return fieldComponent;
}

export async function updateFieldComponentFromDto(
  id: number,
  fieldComponentDto: FieldComponentRequestDto
): Promise<FieldComponent | null> {
  const fieldComponentModel = await getFieldComponent(id);
  if (fieldComponentModel == null) {
    return null;
  }

  fieldComponentModel.set({
    ChildFieldId: fieldComponentDto.childFieldId,
    ParentFieldId: fieldComponentDto.parentFieldId,
  });

  const fieldComponent =
    await FieldComponentRepository.createOrUpdateFieldComponent(
      fieldComponentModel
    );

  return fieldComponent;
}

export async function deleteFieldComponentById(
  fieldComponentId: number
): Promise<void> {
  const whereOptions: WhereOptions<Attributes<FieldComponent>> = {
    id: fieldComponentId,
  };
  await FieldComponentRepository.deleteFieldComponents(whereOptions);
}

export async function deleteFieldComponentsByParentFieldId(
  parentFieldTypeId: number
): Promise<void> {
  const whereOptions: WhereOptions<Attributes<FieldComponent>> = {
    ParentFieldId: parentFieldTypeId,
  };
  await FieldComponentRepository.deleteFieldComponents(whereOptions);
}
