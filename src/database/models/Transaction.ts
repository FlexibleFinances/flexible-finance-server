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
import File from "./File";
import Tag from "./Tag";
import sequelize from "../index";

interface TransactionAttributes {
  name: string;
}

class Transaction extends Model implements TransactionAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly files?: File[];

  public readonly tags?: Tag[];

  public static override associations: {
    files: Association<Transaction, File>;
    tags: Association<Transaction, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getFiles!: HasManyGetAssociationsMixin<File>;
  public setFiles!: HasManySetAssociationsMixin<File, number>;
  public addFile!: HasManyAddAssociationMixin<File, number>;
  public hasFile!: HasManyHasAssociationMixin<File, number>;
  public countFiles!: HasManyCountAssociationsMixin;
  public createFile!: HasManyCreateAssociationMixin<File>;

  public getTags!: HasManyGetAssociationsMixin<Tag>;
  public setTags!: HasManySetAssociationsMixin<Tag, number>;
  public addTag!: HasManyAddAssociationMixin<Tag, number>;
  public hasTag!: HasManyHasAssociationMixin<Tag, number>;
  public countTags!: HasManyCountAssociationsMixin;
  public createTag!: HasManyCreateAssociationMixin<Tag>;
}

Transaction.init(
  {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

export default Transaction;
