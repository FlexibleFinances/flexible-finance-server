import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type EntityRequestDto,
  type EntitySearchRequestDto,
} from "../apiDtos/EntityDtos";
import Entity from "../../database/models/Entity";
import Field from "../../database/models/Field";
import FieldDatum from "../../database/models/FieldDatum";
import Group from "../../database/models/Group";
import Tag from "../../database/models/Tag";
import { defaultLimit } from "../../utils/constants";

export async function getEntityById(entityId: number): Promise<Entity | null> {
  const entity = await Entity.findOne({
    where: {
      id: entityId,
    },
    include: [Group, Field, FieldDatum, Tag],
  });
  return entity;
}

export async function getEntitiesByOptions(
  entityOptions: EntitySearchRequestDto
): Promise<Entity[] | null> {
  const whereOptions: WhereOptions = {};
  if (entityOptions.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: entityOptions.name,
    };
  }
  if (entityOptions.isTemplate !== undefined) {
    whereOptions.isTemplate = {
      [Op.eq]: entityOptions.isTemplate as unknown as boolean,
    };
  }
  if (entityOptions.parentGroupIds !== undefined) {
    whereOptions.group = {
      [Op.in]: entityOptions.parentGroupIds.map((id) => +id),
    };
  }
  if (entityOptions.tagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: entityOptions.tagIds.map((id) => +id),
    };
  }
  if (entityOptions.templateIds !== undefined) {
    whereOptions.template = {
      [Op.in]: entityOptions.templateIds.map((id) => +id),
    };
  }

  const findOptions: FindOptions = {
    offset: +(entityOptions.offset ?? 0),
    limit: +(entityOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: [Group, Field, FieldDatum, Tag],
  };

  const entities = await Entity.findAll(findOptions);

  return entities;
}

export async function createEntityFromDto(
  entityDto: EntityRequestDto
): Promise<Entity | null> {
  const createOptions: CreationAttributes<Entity> = {
    name: entityDto.name ?? "",
    GroupId: entityDto.parentGroupId,
    isTemplate: entityDto.isTemplate ?? false,
    TemplateId: entityDto.templateId,
  };
  const entity = await Entity.create(createOptions);

  if (createOptions.isTemplate) {
    if (entityDto.fieldIds !== undefined) {
      await entity.setFields(entityDto.fieldIds);
    }
  } else if (entityDto.fieldValues !== undefined) {
    await FieldDatum.upsertFieldData(entityDto.fieldValues, entity.id);
  }

  await entity.loadAssociatedIds();

  return entity;
}

export async function updateEntityFromDto(
  entityDto: EntityRequestDto
): Promise<Entity | null> {
  const entity = await Entity.findOne({
    where: {
      id: entityDto.id,
    },
  });
  if (entity === null) {
    return null;
  }
  const updateOptions: CreationAttributes<Entity> = {
    name: entityDto.name ?? "",
    GroupId: entityDto.parentGroupId,
    isTemplate: entityDto.isTemplate ?? false,
    TemplateId: entityDto.templateId,
  };
  await entity.update(updateOptions);

  if (updateOptions.isTemplate) {
    if (entityDto.fieldIds !== undefined) {
      await entity.setFields(entityDto.fieldIds);
    }
  } else if (entityDto.fieldValues !== undefined) {
    await FieldDatum.upsertFieldData(entityDto.fieldValues, entity.id);
  }

  await entity.loadAssociatedIds();

  return entity;
}
