import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import AccountGroup from "../../database/models/AccountGroup";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getAccountGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["accountGroupId"] })) {
    return;
  }

  const accountGroup = await AccountGroup.findOne({
    where: {
      id: req.params.accountGroupId,
    },
  });
  if (accountGroup === null) {
    res.status(500).send({
      message: "Account Group not found.",
    });
    return;
  }
  res.status(200).send({
    message: "Account Group gotten.",
    accountGroup: accountGroup,
  });
}

export async function createAccountGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: CreationAttributes<AccountGroup> = {
    name: req.body.name,
  };
  const accountGroup = await AccountGroup.create(createOptions);
  res.status(200).send({
    message: "Account Group created.",
    accountGroup: accountGroup,
  });
}

export async function updateAccountGroup(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["accountGroupId"] },
      { body: ["name"] }
    )
  ) {
    return;
  }

  const accountGroup = await AccountGroup.findOne({
    where: {
      id: req.params.accountGroupId,
    },
  });
  if (accountGroup === null) {
    res.status(500).send({
      message: "Account Group not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<AccountGroup> = {
    name: req.body.name,
  };
  await accountGroup.update(updateOptions);
  res.status(200).send({
    message: "Account Group updated.",
    accountGroup: accountGroup,
  });
}

export async function getAccountGroups(
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
    whereOptions.account = {
      [Op.in]: (req.query.accountIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const accountGroups = await AccountGroup.findAll(findOptions);
  res.status(200).send({
    message: "Account Groups gotten.",
    accountGroups: accountGroups,
  });
}
