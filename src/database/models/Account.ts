import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
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
  WhereAttributeHash,
} from "sequelize";
import AccountGroup from "./AccountGroup";
import Field from "./Field";
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";
import Template from "./Template";
import Transactor from "./Transactor";
import TransactorType from "./TransactorType";
import { transactorTypeEnum } from "../../app/utils/enumerators";

export class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: CreationOptional<number>;
  declare TransactorTypeId: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare FieldIds: CreationOptional<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare FieldDatumIds: CreationOptional<number[]>;
  declare FieldData: NonAttribute<FieldDatum[]>;

  declare AccountGroupId: number;
  declare AccountGroup: NonAttribute<AccountGroup>;

  declare TemplateId: number;
  declare Template: NonAttribute<Template>;

  declare TagIds: NonAttribute<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    AccountGroup: Association<Account, AccountGroup>;
    Fields: Association<Account, Field>;
    FieldData: Association<Account, FieldDatum>;
    Tags: Association<Account, Tag>;
    Template: Association<Account, Template>;
    Transactor: Association<Account, Transactor>;
    TransactorType: Association<Account, TransactorType>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getAccountGroup: BelongsToGetAssociationMixin<AccountGroup>;
  declare setAccountGroup: BelongsToSetAssociationMixin<AccountGroup, number>;

  declare getTransactorType: BelongsToGetAssociationMixin<TransactorType>;

  declare createTransactor: BelongsToCreateAssociationMixin<Transactor>;
  declare getTransactor: BelongsToGetAssociationMixin<Transactor>;
  declare setTransactor: BelongsToSetAssociationMixin<Transactor, number>;

  declare getFieldData: HasManyGetAssociationsMixin<FieldDatum>;
  declare addFieldDatum: HasManyAddAssociationMixin<FieldDatum, number>;
  declare addFieldData: HasManyAddAssociationsMixin<FieldDatum, number>;
  declare setFieldData: HasManySetAssociationsMixin<FieldDatum, number>;
  declare removeFieldDatum: HasManyRemoveAssociationMixin<FieldDatum, number>;
  declare removeFieldData: HasManyRemoveAssociationsMixin<FieldDatum, number>;
  declare hasFieldDatum: HasManyHasAssociationMixin<FieldDatum, number>;
  declare hasFieldData: HasManyHasAssociationsMixin<FieldDatum, number>;
  declare countFieldData: HasManyCountAssociationsMixin;
  declare createFieldDatum: HasManyCreateAssociationMixin<
    FieldDatum,
    "AccountId"
  >;

  declare getTemplate: BelongsToGetAssociationMixin<Template>;
  declare setTemplate: BelongsToSetAssociationMixin<Template, number>;

  public async setFieldDatumAndFieldIds(): Promise<Account> {
    this.setDataValue("FieldDatumIds", []);
    this.setDataValue("FieldIds", []);
    const accountData = await this.getFieldData();
    accountData.forEach((datum) => {
      const fieldDatumIds = this.getDataValue("FieldDatumIds");
      fieldDatumIds.push(datum.id);
      this.setDataValue("FieldDatumIds", fieldDatumIds);
      const fieldIds = this.getDataValue("FieldIds");
      fieldIds.push(datum.FieldId);
      this.setDataValue("FieldIds", fieldIds);
    });
    return this;
  }
}

export function initializeAccount(sequelize: Sequelize): void {
  Account.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        references: {
          model: "Transactors",
          key: "id",
        },
      },
      TransactorTypeId: {
        type: "SMALLINT GENERATED ALWAYS AS (1) STORED",
        set() {
          throw new Error("generatedValue is read-only");
        },
        references: {
          model: "TransactorTypes",
          key: "id",
        },
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
      FieldIds: DataTypes.VIRTUAL,
      FieldDatumIds: DataTypes.VIRTUAL,
    },
    {
      hooks: {
        beforeCreate: async (account, options) => {
          const newTransactor = await Transactor.create({
            TransactorTypeId: transactorTypeEnum.Account,
          });
          account.id = newTransactor.id;
        },
      },
      sequelize,
    }
  );
}

export default Account;

export interface AccountWhereAttributes extends WhereAttributeHash {
  accountGroup: number;
}
