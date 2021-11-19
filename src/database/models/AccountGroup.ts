import { DataTypes, Model } from "sequelize";
import sequelize from "../index";

interface AccountGroupAttributes {
  name: string;
}

export class AccountGroup extends Model implements AccountGroupAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;
}

AccountGroup.init(
  {
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);
