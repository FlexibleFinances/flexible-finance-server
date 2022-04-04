import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Template from "../../database/models/Template";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";
import { templateTypeEnum } from "../utils/enumerators";

export async function getTemplate(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["templateId"] })) {
    return;
  }

  const template = await Template.findOne({
    where: {
      id: req.params.templateId,
    },
  });
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
}

export async function createTemplate(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name", "type"] })) {
    return;
  }
  const createOptions: CreationAttributes<Template> = {
    name: req.body.name,
    type: req.body.type as templateTypeEnum,
  };
  const template = await Template.create(createOptions);
  res.status(200).send({ message: "Template created.", template: template });
}

export async function updateTemplate(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["templateId"] },
      { body: ["name", "type"] }
    )
  ) {
    return;
  }

  const template = await Template.findOne({
    where: {
      id: req.params.templateId,
    },
  });
  if (template === null) {
    res.status(500).send({
      message: "Template not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Template> = {
    name: req.body.name,
    type: req.body.typeId,
  };
  await template.update(updateOptions);
  res.status(200).send({
    message: "Template updated.",
    template: template,
  });
}

export async function getTemplates(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.type !== undefined) {
    whereOptions.type = req.query.type as templateTypeEnum;
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
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const templates = await Template.findAll(findOptions);
  res.status(200).send({
    message: "Templates gotten.",
    templates: templates,
  });
}
