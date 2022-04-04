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
import Role from "./Role";

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

  declare roles: NonAttribute<Role[]>;

  declare static associations: {
    roles: Association<User, Role>;
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
