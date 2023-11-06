import * as FieldTypeComponentRepository from "../repositories/FieldTypeComponentRepository";
import { type Attributes, type WhereOptions } from "sequelize";
import {
  FieldTypeComponentDtoToModel,
  type FieldTypeComponentRequestDto,
  type FieldTypeComponentSearchRequestDto,
} from "../apiDtos/FieldTypeComponentDtos";
import type FieldTypeComponent from "../../database/models/FieldTypeComponent";
import { defaultLimit } from "../../utils/constants";

export async function getFieldTypeComponent(
  fieldTypeComponentId: number
): Promise<FieldTypeComponent | null> {
  const fieldTypeComponent =
    await FieldTypeComponentRepository.getFieldTypeComponent(
      fieldTypeComponentId
    );
  return fieldTypeComponent;
}

export async function getFieldTypeComponents(
  fieldTypeComponentSearchDto: FieldTypeComponentSearchRequestDto
): Promise<FieldTypeComponent[]> {
  const whereOptions: WhereOptions<Attributes<FieldTypeComponent>> = {};

  const searchLimit =
    fieldTypeComponentSearchDto.limit !== undefined
      ? +fieldTypeComponentSearchDto.limit
      : defaultLimit;
  const searchOffset =
    fieldTypeComponentSearchDto.offset !== undefined
      ? +fieldTypeComponentSearchDto.offset
      : 0;

  const fieldTypeComponents =
    await FieldTypeComponentRepository.getFieldTypeComponents(
      whereOptions,
      searchLimit,
      searchOffset
    );

  return fieldTypeComponents;
}

export async function createFieldTypeComponentFromDto(
  fieldTypeComponentDto: FieldTypeComponentRequestDto
): Promise<FieldTypeComponent> {
  const fieldTypeComponentModel = FieldTypeComponentDtoToModel(
    fieldTypeComponentDto
  );
  const fieldTypeComponent =
    await FieldTypeComponentRepository.createOrUpdateFieldTypeComponent(
      fieldTypeComponentModel
    );

  return fieldTypeComponent;
}

export async function updateFieldTypeComponentFromDto(
  id: number,
  fieldTypeComponentDto: FieldTypeComponentRequestDto
): Promise<FieldTypeComponent | null> {
  const fieldTypeComponentModel = await getFieldTypeComponent(id);
  if (fieldTypeComponentModel === null) {
    return null;
  }

  fieldTypeComponentModel.set({
    ChildFieldTypeId: fieldTypeComponentDto.childFieldTypeId,
    ParentFieldTypeId: fieldTypeComponentDto.parentFieldTypeId,
    isRequired: fieldTypeComponentDto.isRequired,
    order: fieldTypeComponentDto.order,
    validator: fieldTypeComponentDto.validator,
  });

  const fieldTypeComponent =
    await FieldTypeComponentRepository.createOrUpdateFieldTypeComponent(
      fieldTypeComponentModel
    );

  return fieldTypeComponent;
}

export async function deleteFieldTypeComponentById(
  fieldTypeComponentId: number
): Promise<void> {
  const whereOptions: WhereOptions<Attributes<FieldTypeComponent>> = {
    id: fieldTypeComponentId,
  };
  await FieldTypeComponentRepository.deleteFieldTypeComponents(whereOptions);
}

export async function deleteFieldTypeComponentByParentFieldTypeId(
  parentFieldTypeId: number
): Promise<void> {
  const whereOptions: WhereOptions<Attributes<FieldTypeComponent>> = {
    ParentFieldTypeId: parentFieldTypeId,
  };
  await FieldTypeComponentRepository.deleteFieldTypeComponents(whereOptions);
}
