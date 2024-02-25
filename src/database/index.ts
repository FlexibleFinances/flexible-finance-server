import { type QueryInterface, Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

let devDB = "";
if (process.env.DEV_DATABASE_URL != null) {
  devDB = process.env.DEV_DATABASE_URL;
}

export async function initializeSequelize(): Promise<Sequelize> {
  let sequelize: Sequelize;
  if (process.env.DATABASE_URL != null) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  } else {
    sequelize = new Sequelize(devDB, { dialect: "postgres" });
  }

  await sequelize.authenticate();
  console.log("Connection has been established successfully.");

  return sequelize;
}

export function initializeMigrator(
  sequelize: Sequelize
): Umzug<QueryInterface> {
  return new Umzug({
    migrations: {
      glob: path.join(__dirname, "/migrations") + "/*",
    },
    storage: new SequelizeStorage({ sequelize }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });
}

export async function runMigrations(
  migrator: Umzug<QueryInterface>
): Promise<void> {
  if (process.env.DB_TEARDOWN === "true") {
    await migrator.down({ to: 0 });
  }

  await migrator.up();

  console.log("Migrations have ran.");
}

export const ROLES = ["user", "admin"];
