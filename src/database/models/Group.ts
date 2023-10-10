import {
  type Association,
  type CreationOptional,
  DataTypes,
  type HasManyAddAssociationMixin,
  type HasManyAddAssociationsMixin,
  type HasManyCountAssociationsMixin,
  type HasManyCreateAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManyHasAssociationMixin,
  type HasManyHasAssociationsMixin,
  type HasManyRemoveAssociationMixin,
  type HasManyRemoveAssociationsMixin,
  type HasManySetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type Account from "./Account";
import type Entity from "./Entity";

export class Group extends Model<
  InferAttributes<Group>,
  InferCreationAttributes<Group>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare AccountIds: NonAttribute<number[]>;
  declare Accounts: NonAttribute<Account[]>;

  declare EntityIds: NonAttribute<number[]>;
  declare Entities: NonAttribute<Entity[]>;

  declare static associations: {
    Accounts: Association<Account, Group>;
    Entities: Association<Entity, Group>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getAccounts: HasManyGetAssociationsMixin<Account>;
  declare addAccount: HasManyAddAssociationMixin<Account, number>;
  declare addAccounts: HasManyAddAssociationsMixin<Account, number>;
  declare setAccounts: HasManySetAssociationsMixin<Account, number>;
  declare removeAccount: HasManyRemoveAssociationMixin<Account, number>;
  declare removeAccounts: HasManyRemoveAssociationsMixin<Account, number>;
  declare hasAccount: HasManyHasAssociationMixin<Account, number>;
  declare hasAccounts: HasManyHasAssociationsMixin<Account, number>;
  declare countAccounts: HasManyCountAssociationsMixin;
  declare createAccounts: HasManyCreateAssociationMixin<Account, "GroupId">;

  declare getEntities: HasManyGetAssociationsMixin<Entity>;
  declare addEntity: HasManyAddAssociationMixin<Entity, number>;
  declare addEntities: HasManyAddAssociationsMixin<Entity, number>;
  declare setEntities: HasManySetAssociationsMixin<Entity, number>;
  declare removeEntity: HasManyRemoveAssociationMixin<Entity, number>;
  declare removeEntities: HasManyRemoveAssociationsMixin<Entity, number>;
  declare hasEntity: HasManyHasAssociationMixin<Entity, number>;
  declare hasEntities: HasManyHasAssociationsMixin<Entity, number>;
  declare countEntities: HasManyCountAssociationsMixin;
  declare createEntitys: HasManyCreateAssociationMixin<Entity, "GroupId">;
}

export function initializeGroup(sequelize: Sequelize): void {
  Group.init(
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

export default Group;
