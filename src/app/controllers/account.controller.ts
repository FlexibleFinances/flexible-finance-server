import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import FieldDatum, { FieldValues } from "../../database/models/FieldDatum";
import {
  hasRequestParameters,
  minimizeAssociationsToIds,
} from "../../utils/helperFunctions";
import Account from "../../database/models/Account";
import Field from "../../database/models/Field";
import Tag from "../../database/models/Tag";
import { defaultLimit } from "../../utils/constants";
import express from "express";

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
    include: [Field, FieldDatum, Tag],
  });
  if (account === null) {
    res.status(500).send({
      message: "Account not found.",
    });
    return;
  }

  minimizeAssociationsToIds(account);

  res.status(200).send({
    message: "Account gotten.",
    account,
  });
}

export async function createAccount(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestParameters(
      req,
      res,
      { body: ["name"] },
      { body: ["TemplateId", "isTemplate"] }
    )
  ) {
    return;
  }

  const createOptions: CreationAttributes<Account> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
    isTemplate: req.body.isTemplate,
    GroupId: req.body.GroupId,
  };
  const account = await Account.create(createOptions);

  if (createOptions.isTemplate) {
    if (req.body.FieldIds !== undefined) {
      await account.addFields(req.body.FieldIds as number[]);
    }
  } else {
    await FieldDatum.upsertFieldData(
      req.body.fieldValues as FieldValues,
      account.id
    );
  }

  await account.loadAssociatedIds();

  res.status(200).send({ message: "Account created.", account });
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
      { body: ["name", "GroupId", "TemplateId", "fieldValues"] }
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
    GroupId: req.body.GroupId,
    TemplateId: req.body.TemplateId,
    isTemplate: account.isTemplate,
  };
  await account.update(updateOptions);

  if (updateOptions.isTemplate) {
    if (req.body.FieldIds !== undefined) {
      await account.setFields(req.body.FieldIds as number[]);
    }
  } else {
    await FieldDatum.upsertFieldData(
      req.body.fieldValues as FieldValues,
      account.id
    );
  }

  await account.loadAssociatedIds();

  res.status(200).send({
    message: "Account updated.",
    account,
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
  if (req.query.isTemplate !== undefined) {
    whereOptions.isTemplate = {
      [Op.eq]: req.query.isTemplate as unknown as boolean,
    };
  }
  if (req.query.GroupIds !== undefined) {
    whereOptions.group = {
      [Op.in]: (req.query.GroupIds as string[]).map((x) => {
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

  const minimizedAccounts: Account[] = [];
  accounts.forEach((account) => {
    minimizedAccounts.push(minimizeAssociationsToIds(account));
  });

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Account Templates gotten.",
      templates: minimizedAccounts,
    });
  } else {
    res.status(200).send({
      message: "Accounts gotten.",
      accounts: minimizedAccounts,
    });
  }
}
