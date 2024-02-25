import * as FieldTypeComponentService from "../services/FieldTypeComponentService";
import * as FieldTypeRepository from "../repositories/FieldTypeRepository";
import { type Attributes, Op, type WhereOptions } from "sequelize";
import {
  FieldTypeDtoToModel,
  type FieldTypeRequestDto,
  type FieldTypeSearchRequestDto,
} from "../apiDtos/FieldTypeDtos";
import type FieldType from "../../database/models/FieldType";
import type FieldTypeComponent from "../../database/models/FieldTypeComponent";
import { defaultLimit } from "../../utils/constants";

export async function getFieldType(
  fieldTypeId: number
): Promise<FieldType | null> {
  const fieldType = await FieldTypeRepository.getFieldType(fieldTypeId);
  return fieldType;
}

export async function getFieldTypes(
  fieldTypeSearchDto: FieldTypeSearchRequestDto
): Promise<FieldType[]> {
  const whereOptions: WhereOptions<Attributes<FieldType>> = {};
  if (fieldTypeSearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: fieldTypeSearchDto.name,
    };
  }
  if (fieldTypeSearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: fieldTypeSearchDto.tagIds.map((id) => +id),
    };
  }
  if (fieldTypeSearchDto.validator != null) {
    whereOptions.validator = {
      [Op.iLike]: fieldTypeSearchDto.validator,
    };
  }
  if (fieldTypeSearchDto.valueType != null) {
    whereOptions.type = {
      [Op.eq]: fieldTypeSearchDto.valueType,
    };
  }

  const searchLimit =
    fieldTypeSearchDto.limit != null ? +fieldTypeSearchDto.limit : defaultLimit;
  const searchOffset =
    fieldTypeSearchDto.offset != null ? +fieldTypeSearchDto.offset : 0;

  const fieldTypes = await FieldTypeRepository.getFieldTypes(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return fieldTypes;
}

export async function createFieldTypeFromDto(
  fieldTypeDto: FieldTypeRequestDto
): Promise<FieldType> {
  const fieldTypeModel = FieldTypeDtoToModel(fieldTypeDto);
  const fieldType = await FieldTypeRepository.createOrUpdateFieldType(
    fieldTypeModel
  );

  const fieldTypeComponentCreationPromises: Array<Promise<FieldTypeComponent>> =
    [];
  fieldTypeDto.childFieldTypeComponents?.forEach(
    (childFieldTypeCompoentDto) => {
      fieldTypeComponentCreationPromises.push(
        FieldTypeComponentService.createFieldTypeComponentFromDto(
          childFieldTypeCompoentDto
        )
      );
    }
  );
  const fieldTypeComponents = await Promise.all(
    fieldTypeComponentCreationPromises
  );
  await fieldType.setChildFieldTypeComponents(
    fieldTypeComponents.map((fieldTypeComponent) => fieldTypeComponent.id)
  );

  await fieldType.setTags(fieldTypeDto.tagIds);

  return fieldType;
}

export async function updateFieldTypeFromDto(
  id: number,
  fieldTypeDto: FieldTypeRequestDto
): Promise<FieldType | null> {
  const fieldTypeModel = await getFieldType(id);
  if (fieldTypeModel == null) {
    return null;
  }

  await FieldTypeComponentService.deleteFieldTypeComponentByParentFieldTypeId(
    id
  );

  fieldTypeModel.set({
    name: fieldTypeDto.name,
    type: fieldTypeDto.valueType ?? undefined,
    validator: fieldTypeDto.validator,
  });

  const fieldType = await FieldTypeRepository.createOrUpdateFieldType(
    fieldTypeModel
  );

  const fieldTypeComponentCreationPromises: Array<Promise<FieldTypeComponent>> =
    [];
  fieldTypeDto.childFieldTypeComponents?.forEach(
    (childFieldTypeCompoentDto) => {
      fieldTypeComponentCreationPromises.push(
        FieldTypeComponentService.createFieldTypeComponentFromDto(
          childFieldTypeCompoentDto
        )
      );
    }
  );
  const fieldTypeComponents = await Promise.all(
    fieldTypeComponentCreationPromises
  );
  await fieldType.setChildFieldTypeComponents(
    fieldTypeComponents.map((fieldTypeComponent) => fieldTypeComponent.id)
  );

  await fieldType.setTags(fieldTypeDto.tagIds);

  return fieldType;
}
