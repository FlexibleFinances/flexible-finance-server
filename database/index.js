import Sequelize from 'sequelize';
import Umzug from 'umzug';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import fs from 'fs';
import { getRoleModel } from './models/role.model.js';
import { getUserModel } from './models/user.model.js';
import { getUserRoleModel } from './models/userRole.model.js';
import path from 'path';
import url from 'url';

const dbDirname = path.dirname(url.fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

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

const migrator = new Umzug({
  migrations: { path: path.join(dbDirname, '/migrations/') },
  resolve: params => {
    if (params.path.endsWith('.mjs') || params.path.endsWith('.js')) {
      function getModule () { import(`file:///${params.path.replace(/\\/g, '/')}`); }
      return {
        name: params.name,
        path: params.path,
        up: async upParams => (await getModule()).up(upParams),
        down: async downParams => (await getModule()).up(downParams),
      };
    }

    return {
      name: params.name,
      path: params.path,
      ...require(params.path),
    };
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
  logger: console,
});

(async () => {
  if (
    process.env.ALLOW_DB_TEARDOWN === 'true' &&
    !fs.existsSync('./.preserve_db')
  ) {
    await migrator.down();
  }
})();

(async () => {
  await migrator.up();
  fs.writeFile('.preserve_db', '', () => {});
})();
