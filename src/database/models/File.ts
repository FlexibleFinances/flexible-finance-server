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
import Transaction from "./Transaction";
import sequelize from "../index";

export interface FileAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  transactions?: Transaction[];
}

export interface FileCreationAttributes
  extends Optional<FileAttributes, "id">,
    Optional<FileAttributes, "createdAt">,
    Optional<FileAttributes, "updatedAt">,
    Optional<FileAttributes, "transactions"> {}

export class File extends Model<FileAttributes, FileCreationAttributes> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly transactions?: Transaction[];

  public static override associations: {
    transactions: Association<File, Transaction>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getTransactions!: HasManyGetAssociationsMixin<Transaction>;
  public setTransactions!: HasManySetAssociationsMixin<Transaction, number>;
  public addTransaction!: HasManyAddAssociationMixin<Transaction, number>;
  public hasTransaction!: HasManyHasAssociationMixin<Transaction, number>;
  public countTransaction!: HasManyCountAssociationsMixin;
  public createTransaction!: HasManyCreateAssociationMixin<Transaction>;
}

File.init(
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

export default File;
