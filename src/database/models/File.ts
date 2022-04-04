import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Transaction from "./Transaction";

export class File extends Model<
  InferAttributes<File>,
  InferCreationAttributes<File>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare transactions: NonAttribute<Transaction[]>;

  declare static associations: {
    transactions: Association<File, Transaction>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTransactions: HasManyGetAssociationsMixin<Transaction>;
  declare addTransaction: HasManyAddAssociationMixin<Transaction, number>;
  declare addTransactions: HasManyAddAssociationsMixin<Transaction, number>;
  declare setTransactions: HasManySetAssociationsMixin<Transaction, number>;
  declare removeTransaction: HasManyRemoveAssociationMixin<Transaction, number>;
  declare removeTransactions: HasManyRemoveAssociationsMixin<
    Transaction,
    number
  >;

  declare hasTransaction: HasManyHasAssociationMixin<Transaction, number>;
  declare hasTransactions: HasManyHasAssociationsMixin<Transaction, number>;
  declare countTransactions: HasManyCountAssociationsMixin;
  declare createTransaction: HasManyCreateAssociationMixin<Transaction, "id">;
}

export function initializeFile(sequelize: Sequelize): void {
  File.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
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
}

export default File;
