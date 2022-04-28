import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Field from "../../database/models/Field";
import Tag from "../../database/models/Tag";
import Template from "../../database/models/Template";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";
import { templateTypeEnum } from "../utils/enumerators";

export async function getTemplate(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["TemplateId"] })) {
    return;
  }

  const template = await Template.findOne({
    where: {
      id: req.params.TemplateId,
    },
    include: [Field, Tag],
  });
  if (template === null) {
    res.status(500).send({
      message: "Template not found.",
    });
    return;
  }
  template.FieldIds = template.Fields.map((field) => field.id);
  template.TagIds = template.Tags.map((tag) => tag.id);
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
  if (req.body.TagIds !== undefined) {
    await template.addTags(req.body.TagIds);
  }
  if (req.body.FieldIds !== undefined) {
    await template.addFields(req.body.FieldIds);
  }
  await template.reload({ include: [Field, Tag] });
  template.FieldIds = template.Fields.map((field) => field.id);
  template.TagIds = template.Tags.map((tag) => tag.id);
  res.status(200).send({
    message: "Template created.",
    template: template,
  });
}

export async function updateTemplate(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["TemplateId"] },
      { body: ["name", "type"] }
    )
  ) {
    return;
  }

  const template = await Template.findOne({
    where: {
      id: req.params.TemplateId,
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
    type: req.body.TypeId,
  };
  await template.update(updateOptions);
  if (req.body.TagIds !== undefined) {
    await template.setTags(req.body.TagIds);
  }
  if (req.body.FieldIds !== undefined) {
    await template.setFields(req.body.FieldIds);
  }
  await template.reload({ include: [Field, Tag] });
  template.FieldIds = template.Fields.map((field) => field.id);
  template.TagIds = template.Tags.map((tag) => tag.id);
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
  if (req.query.AccountIds !== undefined) {
    whereOptions.accounts = {
      [Op.in]: (req.query.AccountIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.FieldIds !== undefined) {
    whereOptions.fields = {
      [Op.in]: (req.query.FieldIds as string[]).map((x) => {
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
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
    include: [Field, Tag],
  };
  const templates = await Template.findAll(findOptions);
  templates.forEach((template) => {
    template.FieldIds = template.Fields.map((field) => field.id);
    template.TagIds = template.Tags.map((tag) => tag.id);
  });
  res.status(200).send({
    message: "Templates gotten.",
    templates: templates,
  });
}
