import {
  type Association,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type CreationOptional,
  DataTypes,
  type HasManyAddAssociationMixin,
  type HasManyAddAssociationsMixin,
  type HasManyCountAssociationsMixin,
  type HasManyCreateAssociationMixin,
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
import type FieldDatum from "./FieldDatum";
import type FieldType from "./FieldType";
import type Tag from "./Tag";
import type Transaction from "./Transaction";
import { getTagIds } from "../../utils/helperFunctions";

export class Field extends Model<
  InferAttributes<Field>,
  InferCreationAttributes<Field>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;
  declare isComponentOnly: CreationOptional<boolean>;

  declare FieldTypeId: number;
  declare FieldType: NonAttribute<FieldType>;

  declare FieldDatumIds: CreationOptional<number[]>;
  declare FieldData: NonAttribute<FieldDatum[]>;

  declare AccountIds: NonAttribute<number[]>;
  declare Accounts: NonAttribute<Account[]>;

  declare EntityIds: NonAttribute<number[]>;
  declare Entities: NonAttribute<Entity[]>;

  declare TransactionIds: NonAttribute<number[]>;
  declare Transactions: NonAttribute<Transaction[]>;

  declare TagIds: CreationOptional<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    FieldData: Association<Field, FieldDatum>;
    FieldType: Association<Field, FieldType>;
    Accounts: Association<Field, Account>;
    Entities: Association<Field, Entity>;
    Tags: Association<Field, Tag>;
    Transactions: Association<Field, Transaction>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
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
    "FieldId"
  >;

  declare getFieldType: BelongsToGetAssociationMixin<FieldType>;
  declare setFieldType: BelongsToSetAssociationMixin<FieldType, number>;

  declare getAccounts: HasManyGetAssociationsMixin<Account>;
  declare addAccount: HasManyAddAssociationMixin<Account, number>;
  declare addAccounts: HasManyAddAssociationsMixin<Account, number>;
  declare setAccounts: HasManySetAssociationsMixin<Account, number>;
  declare removeAccount: HasManyRemoveAssociationMixin<Account, number>;
  declare removeAccounts: HasManyRemoveAssociationsMixin<Account, number>;
  declare hasAccount: HasManyHasAssociationMixin<Account, number>;
  declare hasAccounts: HasManyHasAssociationsMixin<Account, number>;
  declare countAccounts: HasManyCountAssociationsMixin;
  declare createAccount: HasManyCreateAssociationMixin<Account, "id">;

  declare getEntities: HasManyGetAssociationsMixin<Entity>;
  declare addEntity: HasManyAddAssociationMixin<Entity, number>;
  declare addEntities: HasManyAddAssociationsMixin<Entity, number>;
  declare setEntities: HasManySetAssociationsMixin<Entity, number>;
  declare removeEntity: HasManyRemoveAssociationMixin<Entity, number>;
  declare removeEntities: HasManyRemoveAssociationsMixin<Entity, number>;
  declare hasEntity: HasManyHasAssociationMixin<Entity, number>;
  declare hasEntities: HasManyHasAssociationsMixin<Entity, number>;
  declare countEntities: HasManyCountAssociationsMixin;
  declare createEntity: HasManyCreateAssociationMixin<Entity, "id">;

  declare getTransactions: HasManyGetAssociationsMixin<Transaction>;
  declare addTransaction: HasManyAddAssociationMixin<Transaction, number>;
  declare addTransactions: HasManyAddAssociationsMixin<Transaction, number>;
  declare setTransactions: HasManySetAssociationsMixin<Transaction, number>;
  declare removeTransaction: HasManyRemoveAssociationMixin<Transaction, number>;
  declare hasTransaction: HasManyHasAssociationMixin<Transaction, number>;
  declare hasTransactions: HasManyHasAssociationsMixin<Transaction, number>;
  declare countTransactions: HasManyCountAssociationsMixin;
  declare createTransaction: HasManyCreateAssociationMixin<Transaction, "id">;
  declare removeTransactions: HasManyRemoveAssociationsMixin<
    Transaction,
    number
  >;

  declare getTags: HasManyGetAssociationsMixin<Tag>;
  declare addTag: HasManyAddAssociationMixin<Tag, number>;
  declare addTags: HasManyAddAssociationsMixin<Tag, number>;
  declare setTags: HasManySetAssociationsMixin<Tag, number>;
  declare removeTag: HasManyRemoveAssociationMixin<Tag, number>;
  declare removeTags: HasManyRemoveAssociationsMixin<Tag, number>;
  declare hasTag: HasManyHasAssociationMixin<Tag, number>;
  declare hasTags: HasManyHasAssociationsMixin<Tag, number>;
  declare countTags: HasManyCountAssociationsMixin;
  declare createTag: HasManyCreateAssociationMixin<Tag, "id">;

  public async loadTagIds(): Promise<void> {
    const tagIds = await getTagIds(this);
    this.setDataValue("TagIds", tagIds);
  }

  public async loadAssociatedIds(): Promise<void> {
    const loadPromises = [this.loadTagIds()];
    await Promise.all(loadPromises);
  }
}

export function initializeField(sequelize: Sequelize): void {
  Field.init(
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
      FieldTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "FieldType",
          key: "id",
        },
      },
      isComponentOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      FieldDatumIds: DataTypes.VIRTUAL,
      TagIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default Field;
