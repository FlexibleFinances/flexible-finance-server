import express from "express";
import { setAccountRoutes } from "./account.routes";
import { setAuthRoutes } from "./auth.routes";
import { setTemplateRoutes } from "./template.routes";
import { setUserRoutes } from "./user.routes";

export default function setAllRoutes(app: express.Express): void {
  setAccountRoutes(app);
  setAuthRoutes(app);
  setTemplateRoutes(app);
  setUserRoutes(app);
}
