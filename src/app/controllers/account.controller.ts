import Account, {
  AccountCreationAttributes,
  AccountUpdateAttributes,
} from "../../database/models/Account";
import sequelize, { Op } from "sequelize";
import Template from "../../database/models/Template";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getAccount(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { params: ["accountId"] })) {
    return;
  }

  void Account.findOne({
    where: {
      id: req.params.accountId,
    },
    include: Template,
  })
    .then((account) => {
      if (account === null) {
        res.status(500).send({
          message: "Account not found.",
        });
        return;
      }

      account.fields = account.template.fields;
      res.status(200).send({
        message: "Account gotten.",
        account: account,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createAccount(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["name", "templateId"] })) {
    return;
  }

  const createOptions: AccountCreationAttributes = {
    name: req.body.name,
    template: req.body.templateId,
  };
  if (req.body.fieldIds !== undefined) {
    createOptions.fields = req.body.fieldIds;
  }
  if (req.body.accountGroupId !== undefined) {
    createOptions.accountGroup = req.body.accountGroupId;
  }
  if (req.body.datumIds !== undefined) {
    createOptions.data = req.body.datumIds;
  }
  if (req.body.tagIds !== undefined) {
    createOptions.tags = req.body.tagIds;
  }

  Account.create(createOptions)
    .then((newAccount) => {
      res
        .status(200)
        .send({ message: "Account created.", account: newAccount });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateAccount(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["accountId"] })) {
    return;
  }

  void Account.findOne({
    where: {
      id: req.params.accountId,
    },
    include: Template,
  })
    .then((account) => {
      if (account === null) {
        res.status(500).send({
          message: "Account not found.",
        });
        return;
      }
      const updateOptions: AccountUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.accountGroupId !== undefined) {
        updateOptions.accountGroup = req.body.accountGroupId;
      }
      if (req.body.datumIds !== undefined) {
        updateOptions.data = req.body.datumIds;
      }
      if (req.body.tagIds !== undefined) {
        updateOptions.tags = req.body.tagIds;
      }
      if (req.body.templateId !== undefined) {
        updateOptions.template = req.body.templateId;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Account attributes provided.",
        });
        return;
      }

      account
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Account updated.",
            account: account,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function getAccounts(req: express.Request, res: express.Response): void {
  const whereOptions: sequelize.WhereOptions = {};
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

  const findOptions: sequelize.FindOptions = {
    include: Template,
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void Account.findAll(findOptions)
    .then((accounts) => {
      const accountsWithFields = accounts.map((account) => {
        account.fields = account.template.fields;
        return account;
      });
      res.status(200).send({
        message: "Accounts gotten.",
        accounts: accountsWithFields,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
