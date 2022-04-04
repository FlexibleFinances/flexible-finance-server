import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Tag from "./Tag";
import Transaction from "./Transaction";

export class TransactionTag extends Model<
  InferAttributes<TransactionTag>,
  InferCreationAttributes<TransactionTag>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare TransactionId: number;
  declare Transaction: NonAttribute<Transaction>;

  declare TagId: number;
  declare Tag: NonAttribute<Tag>;
}

export function initializeTransactionTag(sequelize: Sequelize): void {
  TransactionTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      TransactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Transaction",
          key: "id",
        },
      },
      TagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tag",
          key: "id",
        },
      },
    },
    {
      sequelize,
    }
  );
}

export default TransactionTag;
