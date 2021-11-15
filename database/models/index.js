import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { getRoleModel } from './role.model.js';
import { getUserModel } from './user.model.js';
import { getUserRoleModel } from './userRole.model.js';

dotenv.config();

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  );
} else {
  sequelize = new Sequelize(
    process.env.DEV_DATABASE_URL);
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export const ROLES = ['user', 'admin'];

export const Role = getRoleModel(sequelize, Sequelize.DataTypes);
export const User = getUserModel(sequelize, Sequelize.DataTypes);
export const UserRole = getUserRoleModel(sequelize, Sequelize.DataTypes, {
  User,
  Role,
});

export { sequelize };
