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
} from "sequelize";
import Account from "./Account";
import Entity from "./Entity";
import Field from "./Field";
import FieldDatum from "./FieldDatum";
import File from "./File";
import Tag from "./Tag";
import Template from "./Template";
import Transactor from "./Transactor";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare SourceTransactorId: CreationOptional<number>;
  declare SourceTransactor: NonAttribute<Account | Entity>;
  declare RecipientTransactorId: CreationOptional<number>;
  declare RecipientTransactor: NonAttribute<Account | Entity>;

  declare TemplateId: number;
  declare Template: NonAttribute<Template>;

  declare FieldIds: CreationOptional<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare FieldDatumIds: CreationOptional<number[]>;
  declare FieldData: NonAttribute<FieldDatum[]>;

  declare FileIds: NonAttribute<number[]>;
  declare Files: NonAttribute<File[]>;

  declare TagIds: NonAttribute<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    Fields: Association<Transaction, Field>;
    FieldData: Association<Transaction, FieldDatum>;
    Files: Association<Transaction, File>;
    Tags: Association<Transaction, Tag>;
    Template: Association<Transaction, Template>;
    SourceTransactor: Association<Transaction, Transactor>;
    RecipientTransactor: Association<Transaction, Transactor>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare addFieldDatum: HasManyAddAssociationMixin<FieldDatum, number>;
  declare addFieldData: HasManyAddAssociationsMixin<FieldDatum, number>;
  declare countFieldData: HasManyCountAssociationsMixin;
  declare getFieldData: HasManyGetAssociationsMixin<FieldDatum>;
  declare hasFieldDatum: HasManyHasAssociationMixin<FieldDatum, number>;
  declare hasFieldData: HasManyHasAssociationsMixin<FieldDatum, number>;
  declare removeFieldDatum: HasManyRemoveAssociationMixin<FieldDatum, number>;
  declare removeFieldData: HasManyRemoveAssociationsMixin<FieldDatum, number>;
  declare setFieldData: HasManySetAssociationsMixin<FieldDatum, number>;
  declare createFieldDatum: HasManyCreateAssociationMixin<
    FieldDatum,
    "TransactionId"
  >;

  declare getTemplate: BelongsToGetAssociationMixin<Template>;
  declare setTemplate: BelongsToSetAssociationMixin<Template, number>;

  declare addFile: HasManyAddAssociationMixin<File, number>;
  declare addFiles: HasManyAddAssociationsMixin<File, number>;
  declare countFiles: HasManyCountAssociationsMixin;
  declare createFile: HasManyCreateAssociationMixin<File, "id">;
  declare getFiles: HasManyGetAssociationsMixin<File>;
  declare hasFile: HasManyHasAssociationMixin<File, number>;
  declare hasFiles: HasManyHasAssociationsMixin<File, number>;
  declare removeFile: HasManyRemoveAssociationMixin<File, number>;
  declare removeFiles: HasManyRemoveAssociationsMixin<File, number>;
  declare setFiles: HasManySetAssociationsMixin<File, number>;

  declare addTag: HasManyAddAssociationMixin<Tag, number>;
  declare addTags: HasManyAddAssociationsMixin<Tag, number>;
  declare countTags: HasManyCountAssociationsMixin;
  declare createTag: HasManyCreateAssociationMixin<Tag, "id">;
  declare getTags: HasManyGetAssociationsMixin<Tag>;
  declare hasTag: HasManyHasAssociationMixin<Tag, number>;
  declare hasTags: HasManyHasAssociationsMixin<Tag, number>;
  declare removeTag: HasManyRemoveAssociationMixin<Tag, number>;
  declare removeTags: HasManyRemoveAssociationsMixin<Tag, number>;
  declare setTags: HasManySetAssociationsMixin<Tag, number>;

  declare createSourceTransactor: BelongsToCreateAssociationMixin<Transactor>;
  declare getSourceTransactor: BelongsToGetAssociationMixin<Transactor>;
  declare setSourceTransactor: BelongsToSetAssociationMixin<Transactor, number>;

  declare createRecipientTransactor: BelongsToCreateAssociationMixin<Transactor>;
  declare getRecipientTransactor: BelongsToGetAssociationMixin<Transactor>;
  declare setRecipientTransactor: BelongsToSetAssociationMixin<
    Transactor,
    number
  >;

  public async setFieldDatumAndFieldIds(): Promise<Transaction> {
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

export function initializeTransaction(sequelize: Sequelize): void {
  Transaction.init(
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
      SourceTransactorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Transactors",
          key: "id",
        },
      },
      RecipientTransactorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Transactors",
          key: "id",
        },
      },
      FieldIds: DataTypes.VIRTUAL,
      FieldDatumIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default Transaction;
