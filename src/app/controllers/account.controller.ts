import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import Account from "../../database/models/Account";
import FieldDatum from "../../database/models/FieldDatum";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export async function getAccount(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestParameters(req, res, { params: ["AccountId"] })) {
    return;
  }

  const account = await Account.findOne({
    where: {
      id: req.params.AccountId,
    },
  });
  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }

  await account.setFieldDatumAndFieldIds();

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
      body: ["name", "TemplateId", "AccountGroupId"],
    })
  ) {
    return;
  }

  const createOptions: CreationAttributes<Account> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
    AccountGroupId: req.body.AccountGroupId,
  };
  const account = await Account.create(createOptions);

  await FieldDatum.createFieldData(req.body.fieldValues, account.id);
  await account.reload();
  await account.setFieldDatumAndFieldIds();

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
      { params: ["AccountId"] },
      { body: ["name", "AccountGroupId", "TemplateId"] }
    )
  ) {
    return;
  }

  const account = await Account.findOne({
    where: {
      id: req.params.AccountId,
    },
  });
  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Account> = {
    name: req.body.name,
    AccountGroupId: req.body.AccountGroupId,
    TemplateId: req.body.TemplateId,
  };
  await account.update(updateOptions);

  await account.setFieldDatumAndFieldIds();

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
  if (req.query.AccountGroupIds !== undefined) {
    whereOptions.accountGroup = {
      [Op.in]: (req.query.AccountGroupIds as string[]).map((x) => {
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
  if (req.query.TemplateIds !== undefined) {
    whereOptions.template = {
      [Op.in]: (req.query.TemplateIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };
  const accounts = await Account.findAll(findOptions);

  const accountFieldPromises = accounts.map(async (account) => {
    return await account.setFieldDatumAndFieldIds();
  });

  const accountsWithFields = await Promise.all(accountFieldPromises);

  res.status(200).send({
    message: "Accounts gotten.",
    accounts: accountsWithFields,
  });
}
