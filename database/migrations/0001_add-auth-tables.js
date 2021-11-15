import { Role, User, UserRole, sequelize } from '../models/index.js';

async function up () {
  await Promise.all([User.sync(), Role.sync()]);
  await UserRole.sync();

  Role.create({
    id: 1,
    name: 'user',
  });

  Role.create({
    id: 2,
    name: 'admin',
  });
}

async function down () {
  await sequelize.queryInterface.dropTable('Users');
  await sequelize.queryInterface.dropTable('Roles');
  await sequelize.queryInterface.dropTable('UserRoles');
}

module.exports = { up, down };
