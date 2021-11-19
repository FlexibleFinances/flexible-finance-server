import { DataTypes, Model } from "sequelize";
import sequelize from "../index";

interface StatusAttributes {
  name: string;
}

export class Status extends Model implements StatusAttributes {
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
    },
  },
  {
    sequelize,
  }
);
