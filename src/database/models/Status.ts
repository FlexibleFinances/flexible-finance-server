import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../index";

export interface StatusAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
}

export interface StatusCreationAttributes
  extends Optional<StatusAttributes, "id">,
    Optional<StatusAttributes, "createdAt">,
    Optional<StatusAttributes, "updatedAt"> {}

export class Status extends Model<StatusAttributes, StatusCreationAttributes> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;
}

Status.init(
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

export default Status;
