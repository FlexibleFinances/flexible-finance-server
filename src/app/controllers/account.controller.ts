import sequelize, { Op } from "sequelize";
import Account from "../../database/models/Account";
import Template from "../../database/models/Template";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";
import { templateTypeEnum } from "../utils/enumerators";

export function getAccount(req: express.Request, res: express.Response): void {
  if (!hasRequestParameters(req, res, { body: ["accountId"] })) {
    return;
  }

  void Account.findOne({
    where: {
      id: req.params.accountId,
    },
    include: Template,
  })
    .then((account) => {
      if (account !== null) {
        account?.template?.getFields().then((fields) => {
          account.fields = fields ?? [];
          res.status(200).send({
            message: "Account gotten.",
            account: account,
          });
        });
      } else {
        res.status(500).send({
          message: "Account not found.",
        });
      }
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createAccount(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  let templateId: number;
  if (req.body.templateId === undefined || req.body.templateId === null) {
    void Template.create({
      name: (req.body.name as string) + " Custom Template",
      type: templateTypeEnum.Account,
    })
      .then((template) => {
        templateId = template.id;
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    templateId = req.body.templateId;
  }

  Account.create({
    name: req.body.name,
  })
    .then((newAccount) => {
      void newAccount.setTemplate(templateId).then(() => {
        res
          .status(200)
          .send({ message: "Account created.", account: newAccount });
      });
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
      if (account !== null) {
        const updatePromises = [];
        if (req.body.name !== undefined) {
          account.name = req.body.name;
        }
        if (req.body.accountGroupId !== undefined) {
          updatePromises.push(account.setAccountGroup(req.body.accountGroupId));
        }
        if (req.body.datumIds !== undefined) {
          updatePromises.push(account.setData(req.body.datumIds));
        }
        if (req.body.tagIds !== undefined) {
          updatePromises.push(account.setTags(req.body.tagIds));
        }
        if (req.body.templateId !== undefined) {
          updatePromises.push(account.setTemplate(req.body.templateId));
        }
        Promise.all(updatePromises)
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
      } else {
        res.status(500).send({
          message: "Account not found.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function getAccounts(req: express.Request, res: express.Response): void {
  const finderOptions: sequelize.FindOptions = {
    include: Template,
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
  };

  if (req.query.roles !== undefined) {
    finderOptions.where = {
      roles: {
        [Op.in]: req.query.roles as string[],
      },
    };
  }

  void Account.findAll(finderOptions)
    .then((accounts) => {
      const accountFieldPromises = accounts.map(async (account) => {
        return await account.template?.getFields();
      });
      Promise.all(accountFieldPromises)
        .then((accountsWithFields) => {
          res.status(200).send({
            message: "Accounts gotten.",
            accounts: accountsWithFields,
          });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
