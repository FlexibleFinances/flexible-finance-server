import {
  type Association,
  type CreationOptional,
  DataTypes,
  type HasManyAddAssociationMixin,
  type HasManyAddAssociationsMixin,
  type HasManyCountAssociationsMixin,
  type HasManyGetAssociationsMixin,
  type HasManyHasAssociationMixin,
  type HasManyHasAssociationsMixin,
  type HasManyRemoveAssociationMixin,
  type HasManyRemoveAssociationsMixin,
  type HasManySetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type Account from "./Account";
import type Entity from "./Entity";
import type Field from "./Field";
import type FieldType from "./FieldType";
import type Report from "./Report";
import type Transaction from "./Transaction";

export class Tag extends Model<
  InferAttributes<Tag>,
  InferCreationAttributes<Tag>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare AccountIds: CreationOptional<number[]>;
  declare Accounts: NonAttribute<Account[]>;

  declare EntityIds: CreationOptional<number[]>;
  declare Entities: NonAttribute<Entity[]>;

  declare FieldIds: CreationOptional<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare FieldTypeIds: CreationOptional<number[]>;
  declare FieldTypes: NonAttribute<FieldType[]>;

  declare ReportIds: NonAttribute<number[]>;
  declare Reports: NonAttribute<Report[]>;

  declare TransactionIds: CreationOptional<number[]>;
  declare Transactions: NonAttribute<Transaction[]>;

  declare static associations: {
    Accounts: Association<Account, Tag>;
    Entities: Association<Entity, Tag>;
    Fields: Association<Field, Tag>;
    FieldTypes: Association<FieldType, Tag>;
    Reports: Association<Report, Tag>;
    Transactions: Association<Transaction, Tag>;
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

  declare getFields: HasManyGetAssociationsMixin<Field>;
  declare addField: HasManyAddAssociationMixin<Field, number>;
  declare addFields: HasManyAddAssociationsMixin<Field, number>;
  declare setFields: HasManySetAssociationsMixin<Field, number>;
  declare removeField: HasManyRemoveAssociationMixin<Field, number>;
  declare removeFields: HasManyRemoveAssociationsMixin<Field, number>;
  declare hasField: HasManyHasAssociationMixin<Field, number>;
  declare hasFields: HasManyHasAssociationsMixin<Field, number>;
  declare countFields: HasManyCountAssociationsMixin;

  declare getFieldTypes: HasManyGetAssociationsMixin<FieldType>;
  declare addFieldType: HasManyAddAssociationMixin<FieldType, number>;
  declare addFieldTypes: HasManyAddAssociationsMixin<FieldType, number>;
  declare setFieldTypes: HasManySetAssociationsMixin<FieldType, number>;
  declare removeFieldType: HasManyRemoveAssociationMixin<FieldType, number>;
  declare removeFieldTypes: HasManyRemoveAssociationsMixin<FieldType, number>;
  declare hasFieldType: HasManyHasAssociationMixin<FieldType, number>;
  declare hasFieldTypes: HasManyHasAssociationsMixin<FieldType, number>;
  declare countFieldTypes: HasManyCountAssociationsMixin;

  declare getReports: HasManyGetAssociationsMixin<Report>;
  declare addReport: HasManyAddAssociationMixin<Report, number>;
  declare addReports: HasManyAddAssociationsMixin<Report, number>;
  declare setReports: HasManySetAssociationsMixin<Report, number>;
  declare removeReport: HasManyRemoveAssociationMixin<Report, number>;
  declare removeReports: HasManyRemoveAssociationsMixin<Report, number>;
  declare hasReport: HasManyHasAssociationMixin<Report, number>;
  declare hasReports: HasManyHasAssociationsMixin<Report, number>;
  declare countReports: HasManyCountAssociationsMixin;

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
      AccountIds: DataTypes.VIRTUAL,
      EntityIds: DataTypes.VIRTUAL,
      FieldIds: DataTypes.VIRTUAL,
      FieldTypeIds: DataTypes.VIRTUAL,
      TransactionIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default Tag;
