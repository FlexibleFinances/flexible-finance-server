import { Model } from "sequelize";
import { Tag } from "./Tag";
import { Transaction } from "./Transaction";
import sequelize from "..";

export class TransactionTag extends Model {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly transactionId!: number;

  public readonly tagId!: number;
}

TransactionTag.init(
  {},
  {
    sequelize,
  }
);

Transaction.belongsToMany(Tag, { through: TransactionTag });
Tag.belongsToMany(Transaction, { through: TransactionTag });
