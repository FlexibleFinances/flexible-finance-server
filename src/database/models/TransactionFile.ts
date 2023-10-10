import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type File from "./File";
import type Transaction from "./Transaction";

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
