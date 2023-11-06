import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import Entity from "../../database/models/Entity";

export async function getEntity(entityId: number): Promise<Entity | null> {
  const entity = await Entity.findOne({
    where: {
      id: entityId,
      isTemplate: false,
    },
  });
  return entity;
}

export async function getEntityTemplate(
  entityId: number
): Promise<Entity | null> {
  const entity = await Entity.findOne({
    where: {
      id: entityId,
      isTemplate: true,
    },
  });
  return entity;
}

export async function getEntities(
  entityWhereOptions: WhereOptions<Attributes<Entity>>,
  limit: number,
  offset: number
): Promise<Entity[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: entityWhereOptions,
  };

  const entities = await Entity.findAll(findOptions);

  return entities;
}

export async function createOrUpdateEntity(
  entityModel: Entity
): Promise<Entity> {
  const entity = await entityModel.save();
  return entity;
}
