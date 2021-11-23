import File from "./File";
import { Model } from "sequelize";
import Transaction from "./Transaction";
import sequelize from "..";

export class TransactionFile extends Model {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly transactionId!: number;

  public readonly fileId!: number;
}

TransactionFile.init(
  {},
  {
    sequelize,
  }
);

Transaction.belongsToMany(File, { through: TransactionFile });
File.belongsToMany(Transaction, { through: TransactionFile });

export default TransactionFile;
