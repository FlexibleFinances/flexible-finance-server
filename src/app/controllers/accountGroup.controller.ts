import AccountGroup, {
  AccountGroupCreationAttributes,
  AccountGroupUpdateAttributes,
} from "../../database/models/AccountGroup";
import sequelize, { Op } from "sequelize";
import { defaultLimit } from "../utils/constants";
import express from "express";
import { hasRequestParameters } from "../utils/helperFunctions";

export function getAccountGroup(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["accountGroupId"] })) {
    return;
  }

  void AccountGroup.findOne({
    where: {
      id: req.params.accountGroupId,
    },
  })
    .then((accountGroup) => {
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
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createAccountGroup(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { body: ["name"] })) {
    return;
  }

  const createOptions: AccountGroupCreationAttributes = {
    name: req.body.name,
  };
  if (req.body.accountIds !== undefined) {
    createOptions.accounts = req.body.accountIds;
  }

  AccountGroup.create(createOptions)
    .then((newAccountGroup) => {
      res.status(200).send({
        message: "Account Group created.",
        accountGroup: newAccountGroup,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function updateAccountGroup(
  req: express.Request,
  res: express.Response
): void {
  if (!hasRequestParameters(req, res, { params: ["accountGroupId"] })) {
    return;
  }

  void AccountGroup.findOne({
    where: {
      id: req.params.accountGroupId,
    },
  })
    .then((accountGroup) => {
      if (accountGroup === null) {
        res.status(500).send({
          message: "Account Group not found.",
        });
        return;
      }
      const updateOptions: AccountGroupUpdateAttributes = {};
      if (req.body.name !== undefined) {
        updateOptions.name = req.body.name;
      }
      if (req.body.accountIds !== undefined) {
        updateOptions.accounts = req.body.accountIds;
      }
      if (updateOptions === {}) {
        res.status(400).send({
          message: "No Account Group attributes provided.",
        });
        return;
      }

      accountGroup
        .update(updateOptions)
        .then(() => {
          res.status(200).send({
            message: "Account Group updated.",
            accountGroup: accountGroup,
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

export function getAccountGroups(
  req: express.Request,
  res: express.Response
): void {
  const whereOptions: sequelize.WhereOptions = {};
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
  const findOptions: sequelize.FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
  };

  void AccountGroup.findAll(findOptions)
    .then((accountGroups) => {
      res.status(200).send({
        message: "Account Groups gotten.",
        accountGroups: accountGroups,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
