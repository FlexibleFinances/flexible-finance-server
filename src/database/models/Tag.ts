import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Account from "./Account";
import Entity from "./Entity";
import Report from "./Report";
import Template from "./Template";
import Transaction from "./Transaction";

export class Tag extends Model<
  InferAttributes<Tag>,
  InferCreationAttributes<Tag>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare accounts: NonAttribute<Account[]>;

  declare entities: NonAttribute<Entity[]>;

  declare reports: NonAttribute<Report[]>;

  declare templates: NonAttribute<Template[]>;

  declare transactions: NonAttribute<Transaction[]>;

  declare static associations: {
    accounts: Association<Account, Tag>;
    entities: Association<Entity, Tag>;
    reports: Association<Report, Tag>;
    templates: Association<Template, Tag>;
    transactions: Association<Transaction, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getAccounts: HasManyGetAssociationsMixin<Account>;
  declare addAccount: HasManyAddAssociationMixin<Account, number>;
  declare addAccounts: HasManyAddAssociationsMixin<Account, number>;
  declare setAccounts: HasManySetAssociationsMixin<Account, number>;
  declare removeAccount: HasManyRemoveAssociationMixin<Account, number>;
  declare removeAccounts: HasManyRemoveAssociationsMixin<Account, number>;
  declare hasAccount: HasManyHasAssociationMixin<Account, number>;
  declare hasAccounts: HasManyHasAssociationsMixin<Account, number>;
  declare countAccounts: HasManyCountAssociationsMixin;

  declare getEntities: HasManyGetAssociationsMixin<Entity>;
  declare addEntity: HasManyAddAssociationMixin<Entity, number>;
  declare addEntities: HasManyAddAssociationsMixin<Entity, number>;
  declare setEntities: HasManySetAssociationsMixin<Entity, number>;
  declare removeEntity: HasManyRemoveAssociationMixin<Entity, number>;
  declare removeEntities: HasManyRemoveAssociationsMixin<Entity, number>;
  declare hasEntity: HasManyHasAssociationMixin<Entity, number>;
  declare hasEntities: HasManyHasAssociationsMixin<Entity, number>;
  declare countEntities: HasManyCountAssociationsMixin;

  declare getReports: HasManyGetAssociationsMixin<Report>;
  declare addReport: HasManyAddAssociationMixin<Report, number>;
  declare addReports: HasManyAddAssociationsMixin<Report, number>;
  declare setReports: HasManySetAssociationsMixin<Report, number>;
  declare removeReport: HasManyRemoveAssociationMixin<Report, number>;
  declare removeReports: HasManyRemoveAssociationsMixin<Report, number>;
  declare hasReport: HasManyHasAssociationMixin<Report, number>;
  declare hasReports: HasManyHasAssociationsMixin<Report, number>;
  declare countReports: HasManyCountAssociationsMixin;

  declare getTemplates: HasManyGetAssociationsMixin<Template>;
  declare addTemplate: HasManyAddAssociationMixin<Template, number>;
  declare addTemplates: HasManyAddAssociationsMixin<Template, number>;
  declare setTemplates: HasManySetAssociationsMixin<Template, number>;
  declare removeTemplate: HasManyRemoveAssociationMixin<Template, number>;
  declare removeTemplates: HasManyRemoveAssociationsMixin<Template, number>;
  declare hasTemplate: HasManyHasAssociationMixin<Template, number>;
  declare hasTemplates: HasManyHasAssociationsMixin<Template, number>;
  declare countTemplates: HasManyCountAssociationsMixin;

  declare getTransactions: HasManyGetAssociationsMixin<Transaction>;
  declare addTransaction: HasManyAddAssociationMixin<Transaction, number>;
  declare addTransactions: HasManyAddAssociationsMixin<Transaction, number>;
  declare setTransactions: HasManySetAssociationsMixin<Transaction, number>;
  declare removeTransaction: HasManyRemoveAssociationMixin<Transaction, number>;
  declare removeTransactions: HasManyRemoveAssociationsMixin<
    Transaction,
    number
  >;

  declare hasTransaction: HasManyHasAssociationMixin<Transaction, number>;
  declare hasTransactions: HasManyHasAssociationsMixin<Transaction, number>;
  declare countTransactions: HasManyCountAssociationsMixin;
}

export function initializeTag(sequelize: Sequelize): void {
  Tag.init(
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
    },
    {
      sequelize,
    }
  );
}

export default Tag;
