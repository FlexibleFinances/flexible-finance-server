import {
  Entity,
  EntityCreationAttributes,
  EntityUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getEntity(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["entityId"] })) {
    return;
  }

  void Entity.findOne({
    where: {
      id: req.params.entityId,
    },
  })
    .then((entity) => {
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
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createEntity(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: EntityCreationAttributes = {
    name: req.body.name,
  };
  if (req.body.datumIds !== undefined) {
    createOptions.data = req.body.datumIds;
  }
  if (req.body.tagIds !== undefined) {
    createOptions.tags = req.body.tagIds;
  }

  Entity.create(createOptions)
    .then((newEntity) => {
      res.status(200).send({ message: "Entity created.", entity: newEntity });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateEntity(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["entityId"] })) {
    return;
  }

  void Entity.findOne({
    where: {
      id: req.params.entityId,
    },
  })
    .then((entity) => {
      if (entity === null) {
        res.status(500).send({
          message: "Entity not found.",
        });
        return;
      }
      const updateOptions: EntityUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.datumIds !== undefined) {
        updateOptions.data = req.body.datumIds;
      }
      if (req.body.tagIds !== undefined) {
        updateOptions.tags = req.body.tagIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Entity attributes provided.",
        });
        return;
      }

      entity
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Entity updated.",
            entity: entity,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function getEntities(req: express.Request, res: express.Response): void {
  const whereOptions: sequelize.WhereOptions = {};
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

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void Entity.findAll(findOptions)
    .then((entities) => {
      res.status(200).send({
        message: "Entities gotten.",
        entities: entities,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
