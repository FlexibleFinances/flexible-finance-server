import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  Model,
  Optional,
} from "sequelize";
import Role from "./Role";
import sequelize from "../index";

export interface UserAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  username: string;
  email: string;
  password: string;
  roles?: Role[];
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id">,
    Optional<UserAttributes, "createdAt">,
    Optional<UserAttributes, "updatedAt">,
    Optional<UserAttributes, "roles"> {}

export interface UserUpdateAttributes {
  username?: string;
  email?: string;
  password?: string;
  roles?: Role[];
}

export class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public username!: string;

  public email!: string;

  public password!: string;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getRoles!: HasManyGetAssociationsMixin<Role>;
  public setRoles!: HasManySetAssociationsMixin<Role, number>;
  public addRole!: HasManyAddAssociationMixin<Role, number>;
  public hasRole!: HasManyHasAssociationMixin<Role, number>;
  public countRoles!: HasManyCountAssociationsMixin;
  public createRole!: HasManyCreateAssociationMixin<Role>;

  public readonly roles?: Role[];

  public static override associations: {
    roles: Association<User, Role>;
  };
}

User.init(
  {
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

export default User;
