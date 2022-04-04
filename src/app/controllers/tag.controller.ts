import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Tag from "../../database/models/Tag";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getTag(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["tagId"] })) {
    return;
  }

  const tag = await Tag.findOne({
    where: {
      id: req.params.tagId,
    },
  });
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
}

export async function createTag(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Tag> = {
    name: req.body.name,
  };
  const tag = await Tag.create(createOptions);
  res.status(200).send({ message: "Tag created.", tag: tag });
}

export async function updateTag(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(req, res, { params: ["tagId"] }, { body: ["name"] })
  ) {
    return;
  }

  const tag = await Tag.findOne({
    where: {
      id: req.params.tagId,
    },
  });
  if (tag === null) {
    res.status(500).send({
      message: "Tag not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Tag> = {
    name: req.body.name,
  };
  await tag.update(updateOptions);
  res.status(200).send({
    message: "Tag updated.",
    tag: tag,
  });
}

export async function getTags(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
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
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const tags = await Tag.findAll(findOptions);
  res.status(200).send({
    message: "Tags gotten.",
    tags: tags,
  });
}
