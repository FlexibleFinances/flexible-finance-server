import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { getAccount, getEntity } from "../../app/controllers";
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

  public getExtensionGetter(): Function {
    switch (TransactorType.name) {
      case "Account":
        return getAccount;
      case "Entity":
        return getEntity;
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
