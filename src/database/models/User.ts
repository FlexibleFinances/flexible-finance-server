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
import type Role from "./Role";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare username: string;

  declare email: string;

  declare password: string;

  declare RoleIds: NonAttribute<number[]>;
  declare Roles: NonAttribute<Role[]>;

  declare static associations: {
    Roles: Association<User, Role>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getRoles: HasManyGetAssociationsMixin<Role>;
  declare addRole: HasManyAddAssociationMixin<Role, number>;
  declare addRoles: HasManyAddAssociationsMixin<Role, number>;
  declare setRoles: HasManySetAssociationsMixin<Role, number>;
  declare removeRole: HasManyRemoveAssociationMixin<Role, number>;
  declare removeRoles: HasManyRemoveAssociationsMixin<Role, number>;
  declare hasRole: HasManyHasAssociationMixin<Role, number>;
  declare hasRoles: HasManyHasAssociationsMixin<Role, number>;
  declare countRoles: HasManyCountAssociationsMixin;
  declare createRole: HasManyCreateAssociationMixin<Role, "id">;
}

export function initializeUser(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      username: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
    },
    {
      sequelize,
    }
  );
}

export default User;
