export function getUserModel (sequelize, Sequelize) {
  const User = sequelize.define('Users', {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
