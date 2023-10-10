import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type Field from "./Field";
import type Transaction from "./Transaction";

export class TransactionField extends Model<
  InferAttributes<TransactionField>,
  InferCreationAttributes<TransactionField>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare TransactionId: number;
  declare Transaction: NonAttribute<Transaction>;

  declare FieldId: number;
  declare Field: NonAttribute<Field>;
}

export function initializeTransactionField(sequelize: Sequelize): void {
  TransactionField.init(
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
      FieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Field",
          key: "id",
        },
      },
    },
    {
      sequelize,
    }
  );
}

export default TransactionField;
