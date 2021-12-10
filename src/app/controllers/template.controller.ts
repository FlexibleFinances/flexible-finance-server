import Template, {
  TemplateCreationAttributes,
} from "../../database/models/Template";
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
      if (template !== null) {
        res.status(200).send({
          message: "Template gotten.",
          template: template,
        });
      } else {
        res.status(500).send({
          message: "Template not found.",
        });
      }
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
    type: req.body.type,
  };

  void Template.create(createOptions)
    .then((newTemplate) => {
      res
        .status(200)
        .send({ message: "Template created.", template: newTemplate });
    })
    .catch((err: Error) => {
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
      if (template !== null) {
        const updatePromises = [];
        if (req.body.name !== undefined) {
          template.name = req.body.name;
        }
        if (req.body.type !== undefined) {
          template.type = req.body.type;
        }
        if (req.body.accountGroupId !== undefined) {
          updatePromises.push(template.setAccounts(req.body.accountIds));
        }
        if (req.body.datumIds !== undefined) {
          updatePromises.push(template.setFields(req.body.fieldIds));
        }
        if (req.body.tagIds !== undefined) {
          updatePromises.push(template.setTags(req.body.tagIds));
        }
        Promise.all(updatePromises)
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
      } else {
        res.status(500).send({
          message: "Template not found.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function getTemplates(
  req: express.Request,
  res: express.Response
): void {
  void Template.findAll()
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
