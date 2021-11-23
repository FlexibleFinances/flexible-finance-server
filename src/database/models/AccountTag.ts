import Account from "./Account";
import { Model } from "sequelize";
import Tag from "./Tag";
import sequelize from "..";

export class AccountTag extends Model {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly accountId!: number;

  public readonly tagId!: number;
}

AccountTag.init(
  {},
  {
    sequelize,
  }
);

Account.belongsToMany(Tag, { through: AccountTag });
Tag.belongsToMany(Account, { through: AccountTag });

export default AccountTag;
