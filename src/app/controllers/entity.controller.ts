import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Entity from "../../database/models/Entity";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["entityId"] })) {
    return;
  }

  const entity = await Entity.findOne({
    where: {
      id: req.params.entityId,
    },
  });
  if (entity === null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Entity gotten.",
    entity: entity,
  });
}

export async function createEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Entity> = {
    name: req.body.name,
  };

  const entity = await Entity.create(createOptions);
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
      { params: ["entityId"] },
      { body: ["name"] }
    )
  ) {
    return;
  }

  const entity = await Entity.findOne({
    where: {
      id: req.params.entityId,
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
  };
  await entity.update(updateOptions);
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
  if (req.query.datumIds !== undefined) {
    whereOptions.data = {
      [Op.in]: (req.query.datumIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.tagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: (req.query.tagIds as string[]).map((x) => {
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
  res.status(200).send({
    message: "Entities gotten.",
    entities: entities,
  });
}
