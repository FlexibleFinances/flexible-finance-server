import {
  Tag,
  TagCreationAttributes,
  TagUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getTag(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["tagId"] })) {
    return;
  }

  void Tag.findOne({
    where: {
      id: req.params.tagId,
    },
  })
    .then((tag) => {
      if (tag === null) {
        res.status(500).send({
          message: "Tag not found.",
        });
        return;
      }

      res.status(200).send({
        message: "Tag gotten.",
        tag: tag,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createTag(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: TagCreationAttributes = {
    name: req.body.name,
  };
  if (req.body.accountIds !== undefined) {
    createOptions.accounts = req.body.accountIds;
  }
  if (req.body.entityIds !== undefined) {
    createOptions.entities = req.body.entityIds;
  }
  if (req.body.reportIds !== undefined) {
    createOptions.reports = req.body.reportIds;
  }
  if (req.body.templateIds !== undefined) {
    createOptions.templates = req.body.templateIds;
  }
  if (req.body.transactionIds !== undefined) {
    createOptions.transactions = req.body.transactionIds;
  }

  Tag.create(createOptions)
    .then((newTag) => {
      res.status(200).send({ message: "Tag created.", tag: newTag });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateTag(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["tagId"] })) {
    return;
  }

  void Tag.findOne({
    where: {
      id: req.params.tagId,
    },
  })
    .then((tag) => {
      if (tag === null) {
        res.status(500).send({
          message: "Tag not found.",
        });
        return;
      }
      const updateOptions: TagUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.accountIds !== undefined) {
        updateOptions.accounts = req.body.accountIds;
      }
      if (req.body.entityIds !== undefined) {
        updateOptions.entities = req.body.entityIds;
      }
      if (req.body.reportIds !== undefined) {
        updateOptions.reports = req.body.reportIds;
      }
      if (req.body.templateIds !== undefined) {
        updateOptions.templates = req.body.templateIds;
      }
      if (req.body.transactionIds !== undefined) {
        updateOptions.transactions = req.body.transactionIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Tag attributes provided.",
        });
        return;
      }

      tag
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Tag updated.",
            tag: tag,
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

export function getTags(req: express.Request, res: express.Response): void {
  const whereOptions: sequelize.WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.accountIds !== undefined) {
    whereOptions.accounts = {
      [Op.in]: (req.query.accountIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.entityIds !== undefined) {
    whereOptions.entities = {
      [Op.in]: (req.query.entityIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.reportIds !== undefined) {
    whereOptions.reports = {
      [Op.in]: (req.query.reportIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.templateIds !== undefined) {
    whereOptions.templates = {
      [Op.in]: (req.query.templateIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.transactionIds !== undefined) {
    whereOptions.transactions = {
      [Op.in]: (req.query.transactionIds as string[]).map((x) => {
        return +x;
      }),
    };
  }

  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void Tag.findAll(findOptions)
    .then((tags) => {
      res.status(200).send({
        message: "Tags gotten.",
        tags: tags,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
