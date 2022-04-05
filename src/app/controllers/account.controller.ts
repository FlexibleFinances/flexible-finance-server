import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Account from "../../database/models/Account";
import Field from "../../database/models/Field";
import Template from "../../database/models/Template";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getAccount(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["accountId"] })) {
    return;
  }

  const account = await Account.findOne({
    where: {
      id: req.params.accountId,
    },
    include: [{ model: Template, include: [Field] }],
  });
  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }
  account.Fields = account.Template.Fields ?? [];
  res.status(200).send({
    message: "Account gotten.",
    account: account,
  });
}

export async function createAccount(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(req, res, {
      body: ["name", "templateId", "accountGroupId"],
    })
  ) {
    return;
  }

  const createOptions: CreationAttributes<Account> = {
    name: req.body.name,
    TemplateId: req.body.templateId,
    AccountGroupId: req.body.accountGroupId,
  };
  const account = await Account.create(createOptions);
  res.status(200).send({ message: "Account created.", account: account });
}

export async function updateAccount(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { params: ["accountId"] },
      { body: ["name", "accountGroupId", "templateId"] }
    )
  ) {
    return;
  }

  const account = await Account.findOne({
    where: {
      id: req.params.accountId,
    },
    include: Template,
  });
  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Account> = {
    name: req.body.name,
    AccountGroupId: req.body.accountGroupId,
    TemplateId: req.body.templateId,
  };
  await account.update(updateOptions);
  res.status(200).send({
    message: "Account updated.",
    account: account,
  });
}

export async function getAccounts(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.accountGroupIds !== undefined) {
    whereOptions.accountGroup = {
      [Op.in]: (req.query.accountGroupIds as string[]).map((x) => {
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
  if (req.query.templateIds !== undefined) {
    whereOptions.template = {
      [Op.in]: (req.query.templateIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    include: [{ model: Template, include: [Field] }],
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const accounts = await Account.findAll(findOptions);
  const accountsWithFields = accounts.map((account) => {
    account.Fields = account.Template.Fields ?? [];
    return account;
  });
  res.status(200).send({
    message: "Accounts gotten.",
    accounts: accountsWithFields,
  });
}
