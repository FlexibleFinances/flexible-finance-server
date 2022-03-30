import {
  Template,
  TemplateCreationAttributes,
  TemplateUpdateAttributes,
} from "../../database/models";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getTemplate(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["templateId"] })) {
    return;
  }

  void Template.findOne({
    where: {
      id: req.params.templateId,
    },
  })
    .then((template) => {
      if (template === null) {
        res.status(500).send({
          message: "Template not found.",
        });
        return;
      }

      res.status(200).send({
        message: "Template gotten.",
        template: template,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createTemplate(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["name", "type"] })) {
    return;
  }
  const createOptions: TemplateCreationAttributes = {
    name: req.body.name,
    type: req.body.typeId,
  };

  if (req.body.accountIds !== undefined) {
    createOptions.accounts = req.body.accountIds;
  }
  if (req.body.fieldIds !== undefined) {
    createOptions.fields = req.body.fieldIds;
  }
  if (req.body.tagIds !== undefined) {
    createOptions.tags = req.body.tagIds;
  }

  Template.create(createOptions)
    .then((newTemplate) => {
      res
        .status(200)
        .send({ message: "Template created.", template: newTemplate });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateTemplate(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["templateId"] })) {
    return;
  }

  void Template.findOne({
    where: {
      id: req.params.templateId,
    },
  })
    .then((template) => {
      if (template === null) {
        res.status(500).send({
          message: "Template not found.",
        });
        return;
      }
      const updateOptions: TemplateUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.typeId !== undefined) {
        updateOptions.type = req.body.typeId;
      }
      if (req.body.accountIds !== undefined) {
        updateOptions.accounts = req.body.accountIds;
      }
      if (req.body.fieldIds !== undefined) {
        updateOptions.fields = req.body.fieldIds;
      }
      if (req.body.tagIds !== undefined) {
        updateOptions.tags = req.body.tagIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Template attributes provided.",
        });
        return;
      }

      template
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Template updated.",
            template: template,
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

export function getTemplates(
  req: express.Request,
  res: express.Response
): void {
  const whereOptions: sequelize.WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.type !== undefined) {
    whereOptions.type = req.query.type;
  }
  if (req.query.accountIds !== undefined) {
    whereOptions.accounts = {
      [Op.in]: (req.query.accountIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.fieldIds !== undefined) {
    whereOptions.fields = {
      [Op.in]: (req.query.fieldIds as string[]).map((x) => {
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

  void Template.findAll(findOptions)
    .then((templates) => {
      res.status(200).send({
        message: "Templates gotten.",
        templates: templates,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
