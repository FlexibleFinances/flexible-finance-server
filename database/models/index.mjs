import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.env.DEV_DATABASE_URL,
  {
    dialectOptions: {
      ssl: {
        require: !!process.env.DATABASE_URL,
        rejectUnauthorized: false,
      },
    },
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const ROLES = ['user', 'admin'];

const User = require('./user.model')(sequelize, Sequelize.DataTypes);
const Role = require('./role.model')(sequelize, Sequelize.DataTypes);
const UserRole = require('./userRole.model')(sequelize, Sequelize.DataTypes, {
  User,
  Role,
});

module.exports = {
  sequelize,
  ROLES,
  Role,
  User,
  UserRole,
};
