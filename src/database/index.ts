import { Sequelize } from "sequelize";
import Umzug from "umzug";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

let devDB = "";
if (process.env.DEV_DATABASE_URL !== undefined) {
  devDB = process.env.DEV_DATABASE_URL;
}

let sequelize: Sequelize;
if (process.env.DATABASE_URL !== undefined) {
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

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;

export const migrator = new Umzug({
  migrations: {
    path: path.join(__dirname, "/migrations"),
  },
  storage: "sequelize",
  storageOptions: {
    sequelize: sequelize,
  },
});

export async function runMigrations(migrator: Umzug.Umzug): Promise<void> {
  if (process.env.DB_TEARDOWN === "true") {
    await migrator.down({ to: 0 });
  }

  await migrator.up();

  console.log("Migrations have ran.");
}

export const ROLES = ["user", "admin"];

export type Migration = Umzug.Migration;
