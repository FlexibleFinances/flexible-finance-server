import { DataTypes, Model } from "sequelize";
import sequelize from "../index";

interface TypeAttributes {
  name: string;
}

export class Type extends Model implements TypeAttributes {
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
