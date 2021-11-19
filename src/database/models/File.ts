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
import { Transaction } from "./Transaction";
import sequelize from "../index";

interface FileAttributes {
  name: string;
}

export class File extends Model implements FileAttributes {
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
    },
  },
  {
    sequelize,
  }
);
