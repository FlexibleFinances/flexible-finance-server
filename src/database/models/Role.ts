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
import User from "./User";
import sequelize from "../index";

export interface RoleAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  users?: User[];
}

export interface RoleCreationAttributes
  extends Optional<RoleAttributes, "id">,
    Optional<RoleAttributes, "createdAt">,
    Optional<RoleAttributes, "updatedAt">,
    Optional<RoleAttributes, "users"> {}

export interface RoleUpdateAttributes {
  name?: string;
  users?: User[];
}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly users?: User[];

  public static override associations: {
    users: Association<User, Role>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getUsers!: HasManyGetAssociationsMixin<User>;
  public setUsers!: HasManySetAssociationsMixin<User, number>;
  public addUser!: HasManyAddAssociationMixin<User, number>;
  public hasUser!: HasManyHasAssociationMixin<User, number>;
  public countUsers!: HasManyCountAssociationsMixin;
  public createUser!: HasManyCreateAssociationMixin<User>;
}

Role.init(
  {
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

export default Role;
