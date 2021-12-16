import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../index";

export interface TypeAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
}

export interface TypeCreationAttributes
  extends Optional<TypeAttributes, "id">,
    Optional<TypeAttributes, "createdAt">,
    Optional<TypeAttributes, "updatedAt"> {}

export interface TypeUpdateAttributes {
  name?: string;
}

export class Type extends Model<TypeAttributes, TypeCreationAttributes> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;
}

Type.init(
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

export default Type;
