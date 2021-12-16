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
  Optional,
} from "sequelize";
import { Account } from ".";
import sequelize from "../index";

export interface AccountGroupAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  accounts?: Account[];
}

export interface AccountGroupCreationAttributes
  extends Optional<AccountGroupAttributes, "id">,
    Optional<AccountGroupAttributes, "createdAt">,
    Optional<AccountGroupAttributes, "updatedAt">,
    Optional<AccountGroupAttributes, "accounts"> {}

export interface AccountGroupUpdateAttributes {
  name?: string;
  accounts?: Account[];
}

export class AccountGroup extends Model<
  AccountGroupAttributes,
  AccountGroupCreationAttributes
> {
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
  public getAccounts!: HasManyGetAssociationsMixin<Account>;
  public setAccounts!: HasManySetAssociationsMixin<Account, number>;
  public addAccount!: HasManyAddAssociationMixin<Account, number>;
  public hasAccount!: HasManyHasAssociationMixin<Account, number>;
  public countAccounts!: HasManyCountAssociationsMixin;
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
