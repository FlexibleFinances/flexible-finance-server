module.exports = (sequelize, Sequelize, models) => {
  const UserRole = sequelize.define('UserRoles', {
    UserId: {
      type: Sequelize.INTEGER,
      references: {
        model: models.User,
        key: 'id',
      },
    },
    RoleId: {
      type: Sequelize.INTEGER,
      references: {
        model: models.Role,
        key: 'id',
      },
    },
  });
  models.User.belongsToMany(models.Role, { through: UserRole });
  models.Role.belongsToMany(models.User, { through: UserRole });

  return UserRole;
};
