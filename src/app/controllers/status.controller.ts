import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Status from "../../database/models/Status";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getStatus(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["StatusId"] })) {
    return;
  }

  const status = await Status.findOne({
    where: {
      id: req.params.StatusId,
    },
  });
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
}

export async function createStatus(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<Status> = {
    name: req.body.name,
  };
  const status = await Status.create(createOptions);
  res.status(200).send({ message: "Status created.", status: status });
}

export async function updateStatus(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["StatusId"] },
      { body: ["name"] }
    )
  ) {
    return;
  }

  const status = await Status.findOne({
    where: {
      id: req.params.StatusId,
    },
  });
  if (status === null) {
    res.status(500).send({
      message: "Status not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Status> = {
    name: req.body.name,
  };
  await status.update(updateOptions);
  res.status(200).send({
    message: "Status updated.",
    status: status,
  });
}

export async function getStatuses(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const statuses = await Status.findAll(findOptions);
  res.status(200).send({
    message: "Statuses gotten.",
    statuses: statuses,
  });
}
