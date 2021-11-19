import Role from "../models/Role";
import User from "../models/User";
import UserRole from "../models/UserRole";
import sequelize from "../index";

export async function up(): Promise<void> {
  await Promise.all([User.sync(), Role.sync()]);
  await UserRole.sync();

  await Role.create({
    name: "user",
  });

  await Role.create({
    name: "admin",
  });
  console.log("0001 up");
}

export async function down(): Promise<void> {
  await sequelize.getQueryInterface().dropTable("UserRoles");
  await sequelize.getQueryInterface().dropTable("Users");
  await sequelize.getQueryInterface().dropTable("Roles");
  console.log("0001 down");
}
