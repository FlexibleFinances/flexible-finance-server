import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import Account from "../../database/models/Account";

export async function getAccount(accountId: number): Promise<Account | null> {
  const account = await Account.findOne({
    where: {
      id: accountId,
      isTemplate: false,
    },
  });
  return account;
}

export async function getAccountTemplate(
  accountId: number
): Promise<Account | null> {
  const account = await Account.findOne({
    where: {
      id: accountId,
      isTemplate: true,
    },
  });
  return account;
}

export async function getAccounts(
  accountWhereOptions: WhereOptions<Attributes<Account>>,
  limit: number,
  offset: number
): Promise<Account[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: accountWhereOptions,
  };

  const accounts = await Account.findAll(findOptions);
  console.log(accounts);
  return accounts;
}

export async function createOrUpdateAccount(
  accountModel: Account
): Promise<Account> {
  const account = await accountModel.save();
  return account;
}
