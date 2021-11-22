import { Model } from "sequelize";
import Role from "./Role";
import User from "./User";
import sequelize from "../index";

class UserRole extends Model {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly userId!: number;

  public readonly roleId!: number;
}

UserRole.init(
  {},
  {
    sequelize,
  }
);

Role.belongsToMany(User, { through: UserRole });
User.belongsToMany(Role, { through: UserRole });

export default UserRole;
