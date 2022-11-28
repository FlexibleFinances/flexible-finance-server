import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
  Transaction,
} from "sequelize";
import Account from "./Account";
import Entity from "./Entity";
import TransactorType from "./TransactorType";

export class Transactor extends Model<
  InferAttributes<Transactor>,
  InferCreationAttributes<Transactor>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare TransactorTypeId: number;
  declare TransactorType: NonAttribute<TransactorType>;

  declare Account: NonAttribute<Account>;
  declare Entity: NonAttribute<Entity>;

  declare static associations: {
    Account: Association<Transactor, Account>;
    Entity: Association<Transactor, Entity>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTransactorType: BelongsToGetAssociationMixin<TransactorType>;
  declare setTransactorType: BelongsToSetAssociationMixin<
    TransactorType,
    number
  >;

  declare getAccount: HasOneGetAssociationMixin<Account>;
  declare getEntity: HasOneGetAssociationMixin<Entity>;

  declare addTransaction: HasManyAddAssociationMixin<Transaction, number>;
  declare addTransactions: HasManyAddAssociationsMixin<Transaction, number>;
  declare countTransactions: HasManyCountAssociationsMixin;
  declare getTransactions: HasManyGetAssociationsMixin<Transaction>;
  declare hasTransaction: HasManyHasAssociationMixin<Transaction, number>;
  declare hasTransactions: HasManyHasAssociationsMixin<Transaction, number>;
  declare removeTransaction: HasManyRemoveAssociationMixin<Transaction, number>;
  declare setTransactions: HasManySetAssociationsMixin<Transaction, number>;
  declare removeTransactions: HasManyRemoveAssociationsMixin<
    Transaction,
    number
  >;

  public async loadTransactorType(): Promise<void> {
    const transactorType = await this.getTransactorType();
    this.TransactorType = transactorType;
  }

  public async getChildObject(): Promise<Account | Entity> {
    await this.loadTransactorType();
    switch (this.TransactorType.name) {
      case "Account":
        return this.Account;
      case "Entity":
        return this.Entity;
      default:
        throw new Error("Unknown Transactor Type.");
    }
  }
}

export function initializeTransactor(sequelize: Sequelize): void {
  Transactor.init(
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
      TransactorTypeId: {
        type: DataTypes.SMALLINT,
        references: {
          model: "TransactorTypes",
          key: "id",
        },
      },
    },
    {
      sequelize,
    }
  );
}

export default Transactor;
