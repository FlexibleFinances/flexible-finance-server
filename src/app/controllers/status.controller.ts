import {
  Status,
  StatusCreationAttributes,
  StatusUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getStatus(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["statusId"] })) {
    return;
  }

  void Status.findOne({
    where: {
      id: req.params.statusId,
    },
  })
    .then((status) => {
      if (status === null) {
        res.status(500).send({
          message: "Status not found.",
        });
        return;
      }

      res.status(200).send({
        message: "Status gotten.",
        status: status,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createStatus(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: StatusCreationAttributes = {
    name: req.body.name,
  };

  Status.create(createOptions)
    .then((newStatus) => {
      res.status(200).send({ message: "Status created.", status: newStatus });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateStatus(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["statusId"] })) {
    return;
  }

  void Status.findOne({
    where: {
      id: req.params.statusId,
    },
  })
    .then((status) => {
      if (status === null) {
        res.status(500).send({
          message: "Status not found.",
        });
        return;
      }
      const updateOptions: StatusUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Status attributes provided.",
        });
        return;
      }

      status
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Status updated.",
            status: status,
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

export function getStatuses(req: express.Request, res: express.Response): void {
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

  void Status.findAll(findOptions)
    .then((statuses) => {
      res.status(200).send({
        message: "Statuses gotten.",
        statuses: statuses,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
