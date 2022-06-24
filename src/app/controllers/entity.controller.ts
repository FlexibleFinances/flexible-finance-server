import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Entity from "../../database/models/Entity";
import FieldDatum from "../../database/models/FieldDatum";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["EntityId"] })) {
    return;
  }

  const entity = await Entity.findOne({
    where: {
      id: req.params.EntityId,
    },
  });
  if (entity === null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }

  await entity.setFieldDatumAndFieldIds();

  res.status(200).send({
    message: "Entity gotten.",
    entity: entity,
  });
}

export async function createEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name", "TemplateId"] })) {
    return;
  }

  const createOptions: CreationAttributes<Entity> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
  };

  const entity = await Entity.create(createOptions);

  await FieldDatum.createFieldData(req.body.fieldValues, undefined, entity.id);
  await entity.reload();
  await entity.setFieldDatumAndFieldIds();

  res.status(200).send({ message: "Entity created.", entity: entity });
}

export async function updateEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["EntityId"] },
      { body: ["name", "TemplateId"] }
    )
  ) {
    return;
  }

  const entity = await Entity.findOne({
    where: {
      id: req.params.EntityId,
    },
  });
  if (entity === null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Entity> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
  };
  await entity.update(updateOptions);

  await entity.setFieldDatumAndFieldIds();

  res.status(200).send({
    message: "Entity updated.",
    entity: entity,
  });
}

export async function getEntities(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.TagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: (req.query.TagIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.TemplateIds !== undefined) {
    whereOptions.template = {
      [Op.in]: (req.query.TemplateIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const entities = await Entity.findAll(findOptions);

  const entityFieldPromises = entities.map(async (entity) => {
    return await entity.setFieldDatumAndFieldIds();
  });

  const entitiesWithFields = await Promise.all(entityFieldPromises);

  res.status(200).send({
    message: "Entities gotten.",
    entities: entitiesWithFields,
  });
}
