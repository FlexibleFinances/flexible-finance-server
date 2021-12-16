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
import FieldDatum from "./FieldDatum";
import File from "./File";
import Tag from "./Tag";
import sequelize from "../index";

export interface TransactionAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  data?: FieldDatum[];
  files?: File[];
  tags?: Tag[];
}

export interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, "id">,
    Optional<TransactionAttributes, "createdAt">,
    Optional<TransactionAttributes, "updatedAt">,
    Optional<TransactionAttributes, "data">,
    Optional<TransactionAttributes, "files">,
    Optional<TransactionAttributes, "tags"> {}

export interface TransactionUpdateAttributes {
  name?: string;
  data?: FieldDatum[];
  files?: File[];
  tags?: Tag[];
}

export class Transaction extends Model<
  TransactionAttributes,
  TransactionCreationAttributes
> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly data?: FieldDatum[];

  public readonly files?: File[];

  public readonly tags?: Tag[];

  public static override associations: {
    data: Association<Transaction, FieldDatum>;
    files: Association<Transaction, File>;
    tags: Association<Transaction, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getData!: HasManyGetAssociationsMixin<FieldDatum>;
  public setData!: HasManySetAssociationsMixin<FieldDatum, number>;
  public addDatum!: HasManyAddAssociationMixin<FieldDatum, number>;
  public hasDatum!: HasManyHasAssociationMixin<FieldDatum, number>;
  public countData!: HasManyCountAssociationsMixin;
  public createDatum!: HasManyCreateAssociationMixin<FieldDatum>;

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
      unique: true,
    },
  },
  {
    sequelize,
  }
);

FieldDatum.belongsTo(Transaction);
Transaction.hasMany(FieldDatum);

export default Transaction;
