import sequelize, { migrator, runMigrations } from "./database/index";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import { setAuthRoutes } from "./app/routes/auth.routes";
import { setUserRoutes } from "./app/routes/user.routes";
import toobusy from "toobusy-js";

const app = express();

app
  .use(express.static(path.join(__dirname, "/public")))
  .use(helmet())
  .use(compression())
  .use(cors())
  .use(express.json({ limit: "1kb" }))
  .use(express.urlencoded({ extended: true, limit: "1kb" }))
  .use(hpp())
  .set("views", path.join(__dirname, "/views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"));

app.use(function (req, res, next) {
  if (toobusy()) {
    // log if you see necessary
    res.status(503).send("Server Too Busy");
  } else {
    next();
  }
});

setAuthRoutes(app);
setUserRoutes(app);

runMigrations(migrator)
  .then(() => {
    void sequelize.sync();
  })
  .catch((err: any) => {
    console.log(err);
  });

export default app;
