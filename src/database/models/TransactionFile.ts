import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import File from "./File";
import Transaction from "./Transaction";

export class TransactionFile extends Model<
  InferAttributes<TransactionFile>,
  InferCreationAttributes<TransactionFile>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare TransactionId: number;
  declare Transaction: NonAttribute<Transaction>;

  declare FileId: number;
  declare File: NonAttribute<File>;
}

export function initializeTransactionFile(sequelize: Sequelize): void {
  TransactionFile.init(
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
      FileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "File",
          key: "id",
        },
      },
    },
    {
      sequelize,
    }
  );
}

export default TransactionFile;
