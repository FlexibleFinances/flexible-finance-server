import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import FieldDatum, { FieldValues } from "../../database/models/FieldDatum";
import Entity from "../../database/models/Entity";
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
    entity,
  });
}

export async function createEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(req, res, { body: ["name", "TemplateId", "GroupId"] })
  ) {
    return;
  }

  const createOptions: CreationAttributes<Entity> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
    GroupId: req.body.GroupId,
  };

  const entity = await Entity.create(createOptions);

  await FieldDatum.upsertFieldData(
    req.body.fieldValues as FieldValues,
    undefined,
    entity.id
  );
  await entity.reload();
  await entity.setFieldDatumAndFieldIds();

  res.status(200).send({ message: "Entity created.", entity });
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
      { body: ["name", "fieldValues", "GroupId", "TemplateId"] }
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
    GroupId: req.body.GroupId,
    TemplateId: req.body.TemplateId,
  };
  await entity.update(updateOptions);

  await FieldDatum.upsertFieldData(
    req.body.fieldValues as FieldValues,
    undefined,
    entity.id
  );
  await entity.reload();
  await entity.setFieldDatumAndFieldIds();

  res.status(200).send({
    message: "Entity updated.",
    entity,
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
  if (req.query.GroupIds !== undefined) {
    whereOptions.group = {
      [Op.in]: (req.query.GroupIds as string[]).map((x) => {
        return +x;
      }),
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
