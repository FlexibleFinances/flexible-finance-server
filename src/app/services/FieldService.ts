import * as FieldComponentService from "../services/FieldComponentService";
import * as FieldRepository from "../repositories/FieldRepository";
import { type Attributes, Op, type WhereOptions } from "sequelize";
import {
  FieldDtoToModel,
  type FieldRequestDto,
  type FieldSearchRequestDto,
} from "../apiDtos/FieldDtos";
import type Field from "../../database/models/Field";
import type FieldComponent from "../../database/models/FieldComponent";
import { defaultLimit } from "../../utils/constants";

export async function getField(fieldId: number): Promise<Field | null> {
  const field = await FieldRepository.getField(fieldId);
  return field;
}

export async function getFields(
  fieldSearchDto: FieldSearchRequestDto
): Promise<Field[]> {
  const whereOptions: WhereOptions<Attributes<Field>> = {};
  if (fieldSearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: fieldSearchDto.name,
    };
  }
  if (fieldSearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: fieldSearchDto.tagIds.map((id) => +id),
    };
  }

  const searchLimit =
    fieldSearchDto.limit != null ? +fieldSearchDto.limit : defaultLimit;
  const searchOffset =
    fieldSearchDto.offset != null ? +fieldSearchDto.offset : 0;

  const fields = await FieldRepository.getFields(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return fields;
}

export async function createFieldFromDto(
  fieldDto: FieldRequestDto
): Promise<Field> {
  const fieldModel = FieldDtoToModel(fieldDto);
  const field = await FieldRepository.createOrUpdateField(fieldModel);

  const fieldComponentCreationPromises: Array<Promise<FieldComponent>> = [];
  fieldDto.childFieldComponents?.forEach((fieldCompoentDto) => {
    fieldComponentCreationPromises.push(
      FieldComponentService.createFieldComponentFromDto(fieldCompoentDto)
    );
  });
  const fieldComponents = await Promise.all(fieldComponentCreationPromises);
  await field.setChildFieldComponents(
    fieldComponents.map((fieldComponent) => fieldComponent.id)
  );

  await field.setTags(fieldDto.tagIds);

  return field;
}

export async function updateFieldFromDto(
  id: number,
  fieldDto: FieldRequestDto
): Promise<Field | null> {
  const fieldModel = await getField(id);
  if (fieldModel == null) {
    return null;
  }

  await FieldComponentService.deleteFieldComponentsByParentFieldId(id);

  fieldModel.set({
    name: fieldDto.name,
    FieldTypeId: fieldDto.fieldTypeId,
  });

  const field = await FieldRepository.createOrUpdateField(fieldModel);

  const fieldComponentCreationPromises: Array<Promise<FieldComponent>> = [];
  fieldDto.childFieldComponents?.forEach((childFieldCompoentDto) => {
    fieldComponentCreationPromises.push(
      FieldComponentService.createFieldComponentFromDto(childFieldCompoentDto)
    );
  });
  const fieldComponents = await Promise.all(fieldComponentCreationPromises);
  await field.setChildFieldComponents(
    fieldComponents.map((fieldComponent) => fieldComponent.id)
  );

  await field.setTags(fieldDto.tagIds);

  return field;
}
