'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const thisFile = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.DEV_DATABASE_URL, {
  dialectOptions: {
    ssl: process.env.DATABASE_URL ? true : false
  }
}
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const ROLES = ["user", "admin"];

const User = require('./user.model')(sequelize, Sequelize.DataTypes);
const Role = require('./role.model')(sequelize, Sequelize.DataTypes);
const UserRole = require('./userRole.model')(sequelize, Sequelize.DataTypes, {User, Role});

module.exports = {
  sequelize,
  ROLES,
  User,
  Role,
  UserRole
};
