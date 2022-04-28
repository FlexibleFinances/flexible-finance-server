import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
  WhereAttributeHash,
} from "sequelize";
import AccountGroup from "./AccountGroup";
import Field from "./Field";
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";
import Template from "./Template";

export class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare Fields: CreationOptional<Field[]>;

  declare AccountGroupId: number;
  declare AccountGroup: NonAttribute<AccountGroup>;

  declare TemplateId: number;
  declare Template: NonAttribute<Template>;

  declare DatumIds: NonAttribute<number[]>;
  declare Data: NonAttribute<FieldDatum[]>;

  declare TagIds: NonAttribute<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    AccountGroup: Association<Account, AccountGroup>;
    Data: Association<Account, FieldDatum>;
    Tags: Association<Account, Tag>;
    Template: Association<Account, Template>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getAccountGroup: BelongsToGetAssociationMixin<AccountGroup>;
  declare setAccountGroup: BelongsToSetAssociationMixin<AccountGroup, number>;

  declare getTemplate: BelongsToGetAssociationMixin<Template>;
  declare setTemplate: BelongsToSetAssociationMixin<Template, number>;
}

export function initializeAccount(sequelize: Sequelize): void {
  Account.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      TemplateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Template",
          key: "id",
        },
      },
      AccountGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "AccountGroup",
          key: "id",
        },
      },
      Fields: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default Account;

export interface AccountWhereAttributes extends WhereAttributeHash {
  accountGroup: number;
}
