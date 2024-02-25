import * as EntityRepository from "../repositories/EntityRepository";
import * as FieldDatumService from "../services/FieldDatumService";
import { type Attributes, Op, type WhereOptions } from "sequelize";
import {
  EntityDtoToModel,
  type EntityRequestDto,
  type EntitySearchRequestDto,
} from "../apiDtos/EntityDtos";
import {
  EntityTemplateDtoToModel,
  type EntityTemplateRequestDto,
  type EntityTemplateSearchRequestDto,
} from "../apiDtos/EntityTemplateDtos";
import type Entity from "../../database/models/Entity";
import type FieldDatum from "../../database/models/FieldDatum";
import { defaultLimit } from "../../utils/constants";

export async function getEntity(entityId: number): Promise<Entity | null> {
  const entity = await EntityRepository.getEntity(entityId);
  return entity;
}

export async function getEntityTemplate(
  entityTemplateId: number
): Promise<Entity | null> {
  const entityTemplate = await EntityRepository.getEntityTemplate(
    entityTemplateId
  );
  return entityTemplate;
}

export async function getEntities(
  entitySearchDto: EntitySearchRequestDto
): Promise<Entity[]> {
  const whereOptions: WhereOptions<Attributes<Entity>> = {
    isTemplate: false,
  };
  if (entitySearchDto.fieldIds != null) {
    whereOptions.FieldIds = {
      [Op.overlap]: entitySearchDto.fieldIds.map((id) => +id),
    };
  }
  if (entitySearchDto.fieldDatumIds != null) {
    whereOptions.FieldDatumIds = {
      [Op.overlap]: entitySearchDto.fieldDatumIds.map((id) => +id),
    };
  }
  if (entitySearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: entitySearchDto.name,
    };
  }
  if (entitySearchDto.parentGroupIds != null) {
    whereOptions.ParentGroupId = {
      [Op.in]: entitySearchDto.parentGroupIds.map((id) => +id),
    };
  }
  if (entitySearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: entitySearchDto.tagIds.map((id) => +id),
    };
  }
  if (entitySearchDto.templateIds != null) {
    whereOptions.TemplateId = {
      [Op.in]: entitySearchDto?.templateIds?.map((id) => +id),
    };
  }

  const searchLimit =
    entitySearchDto.limit != null ? +entitySearchDto.limit : defaultLimit;
  const searchOffset =
    entitySearchDto.offset != null ? +entitySearchDto.offset : 0;

  const entities = await EntityRepository.getEntities(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return entities;
}

export async function getEntityTemplates(
  entityTemplateSearchDto: EntityTemplateSearchRequestDto
): Promise<Entity[]> {
  const whereOptions: WhereOptions<Attributes<Entity>> = {
    isTemplate: true,
  };
  if (entityTemplateSearchDto.fieldIds != null) {
    whereOptions.FieldIds = {
      [Op.overlap]: entityTemplateSearchDto.fieldIds.map((id) => +id),
    };
  }
  if (entityTemplateSearchDto.fieldDatumIds != null) {
    whereOptions.FieldDatumIds = {
      [Op.overlap]: entityTemplateSearchDto.fieldDatumIds.map((id) => +id),
    };
  }
  if (entityTemplateSearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: entityTemplateSearchDto.name,
    };
  }
  if (entityTemplateSearchDto.parentGroupIds != null) {
    whereOptions.ParentGroupId = {
      [Op.in]: entityTemplateSearchDto.parentGroupIds.map((id) => +id),
    };
  }
  if (entityTemplateSearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: entityTemplateSearchDto.tagIds.map((id) => +id),
    };
  }

  const searchLimit =
    entityTemplateSearchDto.limit != null
      ? +entityTemplateSearchDto.limit
      : defaultLimit;
  const searchOffset =
    entityTemplateSearchDto.offset != null
      ? +entityTemplateSearchDto.offset
      : 0;

  const entities = await EntityRepository.getEntities(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return entities;
}

export async function createEntityFromDto(
  entityDto: EntityRequestDto
): Promise<Entity> {
  const entityModel = EntityDtoToModel(entityDto);
  const entity = await EntityRepository.createOrUpdateEntity(entityModel);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  entityDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createFieldDatumFromDto(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await entity.setFieldData(fieldData.map((fieldDatum) => fieldDatum.id));

  await entity.setTags(entityDto.tagIds);

  return entity;
}

export async function createEntityTemplateFromDto(
  entityTemplateDto: EntityTemplateRequestDto
): Promise<Entity> {
  const entityTemplateModel = EntityTemplateDtoToModel(entityTemplateDto);
  const entityTemplate = await EntityRepository.createOrUpdateEntity(
    entityTemplateModel
  );

  await entityTemplate.setFields(entityTemplateDto.fieldIds);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  entityTemplateDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createFieldDatumFromDto(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await entityTemplate.setFieldData(
    fieldData.map((fieldDatum) => fieldDatum.id)
  );

  await entityTemplate.setTags(entityTemplateDto.tagIds);

  return entityTemplate;
}

export async function updateEntityFromDto(
  id: number,
  entityDto: EntityRequestDto
): Promise<Entity | null> {
  const entityModel = await getEntity(id);
  if (entityModel == null) {
    return null;
  }

  if (entityDto.templateId !== entityModel.TemplateId) {
    await FieldDatumService.deleteFieldDataByEntityId(id);
  }

  entityModel.set({
    name: entityDto.name,
    ParentGroupId: entityDto.parentGroupId,
    TemplateId: entityDto.templateId,
  });

  const entity = await EntityRepository.createOrUpdateEntity(entityModel);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  entityDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createOrUpdateFieldDatum(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await entity.setFieldData(fieldData.map((fieldDatum) => fieldDatum.id));

  await entity.setTags(entityDto.tagIds);

  return entity;
}

export async function updateEntityTemplateFromDto(
  id: number,
  entityTemplateDto: EntityTemplateRequestDto
): Promise<Entity | null> {
  const entityTemplateModel = await getEntityTemplate(id);
  if (entityTemplateModel == null) {
    return null;
  }

  entityTemplateModel.set({
    name: entityTemplateDto.name,
    ParentGroupId: entityTemplateDto.parentGroupId,
  });

  const entityTemplate = await EntityRepository.createOrUpdateEntity(
    entityTemplateModel
  );

  await entityTemplate.setFields(entityTemplateDto.fieldIds);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  entityTemplateDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createOrUpdateFieldDatum(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await entityTemplate.setFieldData(
    fieldData.map((fieldDatum) => fieldDatum.id)
  );

  await entityTemplate.setTags(entityTemplateDto.tagIds);

  return entityTemplate;
}
