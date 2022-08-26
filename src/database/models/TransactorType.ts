import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Account from "./Account";
import Entity from "./Entity";
import Transactor from "./Transactor";

export class TransactorType extends Model<
  InferAttributes<TransactorType>,
  InferCreationAttributes<TransactorType>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare TransactorIds: NonAttribute<number[]>;
  declare Transactors: NonAttribute<Transactor[]>;

  declare AccountIds: NonAttribute<number[]>;
  declare Accounts: NonAttribute<Account[]>;

  declare EntityIds: NonAttribute<number[]>;
  declare Entities: NonAttribute<Entity[]>;

  declare static associations: {
    Transactors: Association<TransactorType, Transactor>;
    Accounts: Association<TransactorType, Account>;
    Entities: Association<TransactorType, Entity>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTransactors: HasManyGetAssociationsMixin<Transactor>;
  declare hasTransactor: HasManyHasAssociationMixin<Transactor, number>;
  declare hasTransactors: HasManyHasAssociationsMixin<Transactor, number>;
  declare countTransactors: HasManyCountAssociationsMixin;

  declare getAccounts: HasManyGetAssociationsMixin<Account>;
  declare hasAccount: HasManyHasAssociationMixin<Account, number>;
  declare hasAccounts: HasManyHasAssociationsMixin<Account, number>;
  declare countAccounts: HasManyCountAssociationsMixin;

  declare getEntities: HasManyGetAssociationsMixin<Entity>;
  declare hasEntity: HasManyHasAssociationMixin<Entity, number>;
  declare hasEntities: HasManyHasAssociationsMixin<Entity, number>;
  declare countEntities: HasManyCountAssociationsMixin;
}

export function initializeTransactorType(sequelize: Sequelize): void {
  TransactorType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
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

export default TransactorType;
