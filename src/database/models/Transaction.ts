import {
  Association,
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
import Field from "./Field";
import FieldDatum from "./FieldDatum";
import File from "./File";
import Tag from "./Tag";
import Template from "./Template";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

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
    "TransactionId"
  >;

  declare getTemplate: BelongsToGetAssociationMixin<Template>;
  declare setTemplate: BelongsToSetAssociationMixin<Template, number>;

  declare getFiles: HasManyGetAssociationsMixin<File>;
  declare addFile: HasManyAddAssociationMixin<File, number>;
  declare addFiles: HasManyAddAssociationsMixin<File, number>;
  declare setFiles: HasManySetAssociationsMixin<File, number>;
  declare removeFile: HasManyRemoveAssociationMixin<File, number>;
  declare removeFiles: HasManyRemoveAssociationsMixin<File, number>;
  declare hasFile: HasManyHasAssociationMixin<File, number>;
  declare hasFiles: HasManyHasAssociationsMixin<File, number>;
  declare countFiles: HasManyCountAssociationsMixin;
  declare createFile: HasManyCreateAssociationMixin<File, "id">;

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

  public async setFieldDatumAndFieldIds(): Promise<Transaction> {
    this.setDataValue("FieldDatumIds", []);
    this.setDataValue("FieldIds", []);
    const accountData = await this.getFieldData();
    accountData.forEach((datum) => {
      const fieldDatumIds = this.getDataValue("FieldDatumIds");
      fieldDatumIds.push(datum.id);
      this.setDataValue("FieldDatumIds", fieldDatumIds);
      const fieldIds = this.getDataValue("FieldIds");
      fieldIds.push(datum.id);
      this.setDataValue("FieldIds", fieldDatumIds);
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
      FieldIds: DataTypes.VIRTUAL,
      FieldDatumIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default Transaction;
