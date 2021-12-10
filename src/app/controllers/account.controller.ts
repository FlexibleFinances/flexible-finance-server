import Account from "../../database/models/Account";
import Template from "../../database/models/Template";
import templateTypeEnum from "../utils/templateType.enum";

export function getAccount(req: any, res: any): void {
  if (req.params.accountId === undefined) {
    res.status(400).send({ message: "Missing a required parameter." });
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

export async function createAccount(req: any, res: any): Promise<void> {
  if (req.body.name === undefined) {
    res.status(400).send({ message: "Missing a required parameter." });
    return;
  }

  let templateId: number;
  if (req.body.templateId === undefined || req.body.templateId === null) {
    await Template.create({
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

export function getAccounts(req: any, res: any): void {
  void Account.findAll({
    include: Template,
  })
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
