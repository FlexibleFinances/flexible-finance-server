import {
  Role,
  RoleCreationAttributes,
  RoleUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getRole(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["roleId"] })) {
    return;
  }

  void Role.findOne({
    where: {
      id: req.params.roleId,
    },
  })
    .then((role) => {
      if (role === null) {
        res.status(500).send({
          message: "Role not found.",
        });
        return;
      }

      res.status(200).send({
        message: "Role gotten.",
        role: role,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createRole(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: RoleCreationAttributes = {
    name: req.body.name,
  };
  if (req.body.userIds !== undefined) {
    createOptions.users = req.body.userIds;
  }

  Role.create(createOptions)
    .then((newRole) => {
      res.status(200).send({ message: "Role created.", role: newRole });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateRole(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["roleId"] })) {
    return;
  }

  void Role.findOne({
    where: {
      id: req.params.roleId,
    },
  })
    .then((role) => {
      if (role === null) {
        res.status(500).send({
          message: "Role not found.",
        });
        return;
      }
      const updateOptions: RoleUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.userIds !== undefined) {
        updateOptions.users = req.body.userIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Role attributes provided.",
        });
        return;
      }

      role
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Role updated.",
            role: role,
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

export function getRoles(req: express.Request, res: express.Response): void {
  const whereOptions: sequelize.WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.userIds !== undefined) {
    whereOptions.users = {
      [Op.in]: (req.query.userIds as string[]).map((x) => {
        return +x;
      }),
    };
  }

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void Role.findAll(findOptions)
    .then((roles) => {
      res.status(200).send({
        message: "Roles gotten.",
        roles: roles,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
