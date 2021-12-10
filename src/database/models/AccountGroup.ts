import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  Model,
} from "sequelize";
import { Account } from ".";
import sequelize from "../index";

interface AccountGroupAttributes {
  name: string;
}

export class AccountGroup extends Model implements AccountGroupAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly accounts?: Account[];

  public static override associations: {
    accounts: Association<Account, AccountGroup>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getAccount!: HasManyGetAssociationsMixin<Account>;
  public setAccount!: HasManySetAssociationsMixin<Account, number>;
  public addAccounts!: HasManyAddAssociationMixin<Account, number>;
  public hasAccounts!: HasManyHasAssociationMixin<Account, number>;
  public countAccount!: HasManyCountAssociationsMixin;
  public createAccounts!: HasManyCreateAssociationMixin<Account>;
}

AccountGroup.init(
  {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
  }
);

export default AccountGroup;
