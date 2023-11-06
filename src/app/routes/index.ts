import type express from "express";
import { setAccountRoutes } from "./account.routes";
import { setAccountTemplateRoutes } from "./accountTemplate.routes";
import { setAuthRoutes } from "./auth.routes";
import { setAuthTestRoutes } from "./authTest.routes";
import { setEntityRoutes } from "./entity.routes";
import { setEntityTemplateRoutes } from "./entityTemplate.routes";
import { setFieldDatumRoutes } from "./fieldDatum.routes";
import { setFieldRoutes } from "./field.routes";
import { setFieldTypeRoutes } from "./fieldType.routes";
import { setGroupRoutes } from "./group.routes";
import { setTagRoutes } from "./tag.routes";
import { setTransactionRoutes } from "./transaction.routes";
import { setTransactionTemplateRoutes } from "./transactionTemplate.routes";
import { setTransactorRoutes } from "./transactor.routes";
import { setUserRoutes } from "./user.routes";

export default function setAllRoutes(app: express.Express): void {
  setAccountTemplateRoutes(app);
  setAccountRoutes(app);
  setAuthRoutes(app);
  setEntityTemplateRoutes(app);
  setEntityRoutes(app);
  setFieldRoutes(app);
  setFieldDatumRoutes(app);
  setFieldTypeRoutes(app);
  setGroupRoutes(app);
  setTagRoutes(app);
  setTransactionTemplateRoutes(app);
  setTransactionRoutes(app);
  setTransactorRoutes(app);
  setUserRoutes(app);
  setAuthTestRoutes(app);
}
