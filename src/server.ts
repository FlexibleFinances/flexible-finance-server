import { migrator, runMigrations } from "./database/index";
import Account from "./database/models/Account";
import AccountGroup from "./database/models/AccountGroup";
import Entity from "./database/models/Entity";
import EntityTag from "./database/models/EntityTag";
import Field from "./database/models/Field";
import FieldDatum from "./database/models/FieldDatum";
import FieldType from "./database/models/FieldType";
import Report from "./database/models/Report";
import ReportTag from "./database/models/ReportTag";
import Role from "./database/models/Role";
import Status from "./database/models/Status";
import Tag from "./database/models/Tag";
import Template from "./database/models/Template";
import TemplateTag from "./database/models/TemplateTag";
import Transaction from "./database/models/Transaction";
import TransactionFile from "./database/models/TransactionFile";
import TransactionTag from "./database/models/TransactionTag";
import Type from "./database/models/Type";
import User from "./database/models/User";
import UserRole from "./database/models/UserRole";
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
    void Account.sync();
    void AccountGroup.sync();
    void Entity.sync();
    void EntityTag.sync();
    void Field.sync();
    void FieldDatum.sync();
    void FieldType.sync();
    void Report.sync();
    void ReportTag.sync();
    void Role.sync();
    void Status.sync();
    void Tag.sync();
    void Template.sync();
    void TemplateTag.sync();
    void Transaction.sync();
    void TransactionFile.sync();
    void TransactionTag.sync();
    void Type.sync();
    void User.sync();
    void UserRole.sync();
  })
  .catch((err: any) => {
    console.log(err);
  });

export default app;
