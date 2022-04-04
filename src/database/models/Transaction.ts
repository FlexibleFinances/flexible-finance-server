import {
  Association,
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
import FieldDatum from "./FieldDatum";
import File from "./File";
import Tag from "./Tag";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare Data: NonAttribute<FieldDatum[]>;
  declare Files: NonAttribute<File[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    Data: Association<Transaction, FieldDatum>;
    Files: Association<Transaction, File>;
    Tags: Association<Transaction, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getData: HasManyGetAssociationsMixin<FieldDatum>;
  declare addDatum: HasManyAddAssociationMixin<FieldDatum, number>;
  declare addData: HasManyAddAssociationsMixin<FieldDatum, number>;
  declare setData: HasManySetAssociationsMixin<FieldDatum, number>;
  declare removeDatum: HasManyRemoveAssociationMixin<FieldDatum, number>;
  declare removeData: HasManyRemoveAssociationsMixin<FieldDatum, number>;
  declare hasDatum: HasManyHasAssociationMixin<FieldDatum, number>;
  declare hasData: HasManyHasAssociationsMixin<FieldDatum, number>;
  declare countData: HasManyCountAssociationsMixin;
  declare createDatum: HasManyCreateAssociationMixin<
    FieldDatum,
    "TransactionId"
  >;

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
    },
    {
      sequelize,
    }
  );
}

export default Transaction;
