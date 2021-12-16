import {
  Type,
  TypeCreationAttributes,
  TypeUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getType(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["typeId"] })) {
    return;
  }

  void Type.findOne({
    where: {
      id: req.params.typeId,
    },
  })
    .then((type) => {
      if (type === null) {
        res.status(500).send({
          message: "Type not found.",
        });
        return;
      }

      res.status(200).send({
        message: "Type gotten.",
        type: type,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createType(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: TypeCreationAttributes = {
    name: req.body.name,
  };

  Type.create(createOptions)
    .then((newType) => {
      res.status(200).send({ message: "Type created.", type: newType });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateType(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["typeId"] })) {
    return;
  }

  void Type.findOne({
    where: {
      id: req.params.typeId,
    },
  })
    .then((type) => {
      if (type === null) {
        res.status(500).send({
          message: "Type not found.",
        });
        return;
      }
      const updateOptions: TypeUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Type attributes provided.",
        });
        return;
      }

      type
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Type updated.",
            type: type,
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

export function getTypes(req: express.Request, res: express.Response): void {
  const whereOptions: sequelize.WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void Type.findAll(findOptions)
    .then((types) => {
      res.status(200).send({
        message: "Types gotten.",
        types: types,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
