import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  hasRequestArguments,
  minimizeAssociationsToIds,
} from "../../utils/helperFunctions";
import Account from "../../database/models/Account";
import { AccountResponseDto } from "../apiDtos/AccountDtos";
import Entity from "../../database/models/Entity";
import { EntityResponseDto } from "../apiDtos/EntityDtos";
import Field from "../../database/models/Field";
import FieldDatum from "../../database/models/FieldDatum";
import Tag from "../../database/models/Tag";
import Transactor from "../../database/models/Transactor";
import { TransactorResponseDto } from "../apiDtos/TransactorDtos";
import { defaultLimit } from "../../utils/constants";
import type express from "express";

export async function getTransactor(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["TransactorId"] })) {
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
    transactor: new TransactorResponseDto(transactor),
  });
}

export async function createTransactor(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(req, res, {
      body: ["TransactorTypeId"],
    })
  ) {
    return;
  }

  const createOptions: CreationAttributes<Transactor> = {
    TransactorTypeId: req.body.TransactorTypeId,
  };
  const transactor = await Transactor.create(createOptions);

  res.status(200).send({
    message: "Transactor created.",
    transactor: new TransactorResponseDto(transactor),
  });
}

export async function updateTransactor(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(
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
    transactor: new TransactorResponseDto(transactor),
  });
}

export async function getTransactors(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.TransactorTypeIds !== undefined) {
    whereOptions.types = {
      [Op.in]: (req.query.TransactorTypeIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const childWhereOptions: WhereOptions = {};
  if (req.query.isTemplate !== undefined) {
    childWhereOptions.isTemplate = {
      [Op.eq]: req.query.isTemplate as unknown as boolean,
    };
  }
  if (req.query.GroupIds !== undefined) {
    childWhereOptions.group = {
      [Op.in]: (req.query.GroupIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.TagIds !== undefined) {
    childWhereOptions.tags = {
      [Op.in]: (req.query.TagIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.TemplateIds !== undefined) {
    childWhereOptions.template = {
      [Op.in]: (req.query.TemplateIds as string[]).map((x) => {
        return +x;
      }),
    };
  }

  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
    include: [
      {
        model: Account,
        where: childWhereOptions,
        include: [Field, FieldDatum, Tag],
        required: false,
      },
      {
        model: Entity,
        where: childWhereOptions,
        include: [Field, FieldDatum, Tag],
        required: false,
      },
    ],
  };
  const transactors = await Transactor.findAll(findOptions);
  const children = await Promise.all(
    transactors
      .filter((t) => t.Account?.id === t.id || t.Entity?.id === t.id)
      .map(async (t) => minimizeAssociationsToIds(await t.getChildObject()))
  );
  const childrenResponseDtos = children.map((child) => {
    if (child instanceof Account) {
      return new AccountResponseDto(child);
    }
    if (child instanceof Entity) {
      return new EntityResponseDto(child);
    }
    return null;
  });

  res.status(200).send({
    message: "Transactors gotten.",
    transactors: childrenResponseDtos,
  });
}
