import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import Tag from "../../database/models/Tag";
import { TagResponseDto } from "../apiDtos/TagDtos";
import { defaultLimit } from "../../utils/constants";
import type express from "express";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getTag(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["TagId"] })) {
    return;
  }

  const tag = await Tag.findOne({
    where: {
      id: req.params.TagId,
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
    tag: new TagResponseDto(tag),
  });
}

export async function createTag(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Tag> = {
    name: req.body.name,
  };
  const tag = await Tag.create(createOptions);
  res
    .status(200)
    .send({ message: "Tag created.", tag: new TagResponseDto(tag) });
}

export async function updateTag(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(req, res, { params: ["TagId"] }, { body: ["name"] })
  ) {
    return;
  }

  const tag = await Tag.findOne({
    where: {
      id: req.params.TagId,
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
    tag: new TagResponseDto(tag),
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
  if (req.query.AccountIds !== undefined) {
    whereOptions.accounts = {
      [Op.in]: (req.query.AccountIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.EntityIds !== undefined) {
    whereOptions.entities = {
      [Op.in]: (req.query.EntityIds as string[]).map((x) => {
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
  if (req.query.TransactionIds !== undefined) {
    whereOptions.transactions = {
      [Op.in]: (req.query.TransactionIds as string[]).map((x) => {
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
  const tagResponseDtos = tags.map((tag) => new TagResponseDto(tag));
  res.status(200).send({
    message: "Tags gotten.",
    tags: tagResponseDtos,
  });
}
