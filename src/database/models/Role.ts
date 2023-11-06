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
import type User from "./User";

export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare UserIds: CreationOptional<number[]>;
  declare Users: NonAttribute<User[]>;

  declare static associations: {
    Users: Association<User, Role>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getUsers: HasManyGetAssociationsMixin<User>;
  declare addUser: HasManyAddAssociationMixin<User, number>;
  declare addUsers: HasManyAddAssociationsMixin<User, number>;
  declare setUsers: HasManySetAssociationsMixin<User, number>;
  declare removeUser: HasManyRemoveAssociationMixin<User, number>;
  declare removeUsers: HasManyRemoveAssociationsMixin<User, number>;
  declare hasUser: HasManyHasAssociationMixin<User, number>;
  declare hasUsers: HasManyHasAssociationsMixin<User, number>;
  declare countUsers: HasManyCountAssociationsMixin;
  declare createUser: HasManyCreateAssociationMixin<User, "id">;
}

export function initializeRole(sequelize: Sequelize): void {
  Role.init(
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
      UserIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default Role;
