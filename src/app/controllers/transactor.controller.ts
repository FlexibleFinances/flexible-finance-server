import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Account from "../../database/models/Account";
import Entity from "../../database/models/Entity";
import Transactor from "../../database/models/Transactor";
import { defaultLimit } from "../../utils/constants";
import express from "express";
import { hasRequestParameters } from "../../utils/helperFunctions";

export async function getTransactor(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["TransactorId"] })) {
    return;
  }

  const transactor = await Transactor.findOne({
    where: {
      id: req.params.TransactorId,
    },
  });
  if (transactor === null) {
    res.status(500).send({
      message: "Transactor not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Transactor gotten.",
    transactor,
  });
}

export async function createTransactor(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(req, res, {
      body: ["TransactorTypeId"],
    })
  ) {
    return;
  }

  const createOptions: CreationAttributes<Transactor> = {
    TransactorTypeId: req.body.TransactorTypeId,
  };
  const transactor = await Transactor.create(createOptions);

  res.status(200).send({ message: "Transactor created.", transactor });
}

export async function updateTransactor(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["TransactorId"] },
      { body: ["TransactorTypeId"] }
    )
  ) {
    return;
  }

  const transactor = await Transactor.findOne({
    where: {
      id: req.params.TransactorId,
    },
  });
  if (transactor === null) {
    res.status(500).send({
      message: "Transactor not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Transactor> = {
    TransactorTypeId: req.body.TransactorTypeId,
  };
  await transactor.update(updateOptions);

  res.status(200).send({
    message: "Transactor updated.",
    transactor,
  });
}

export async function getTransactors(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.TransactorIds !== undefined) {
    whereOptions.id = {
      [Op.in]: (req.query.TransactorIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.TransactorTypeIds !== undefined) {
    whereOptions.types = {
      [Op.in]: (req.query.TransactorTypeIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
    include: [Account, Entity],
  };
  const transactors = await Transactor.findAll(findOptions);

  res.status(200).send({
    message: "Transactors gotten.",
    transactors,
  });
}
