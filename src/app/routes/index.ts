import express from "express";
import { setAccountRoutes } from "./account.routes";
import { setAuthRoutes } from "./auth.routes";
import { setAuthTestRoutes } from "./authTest.routes";
import { setTemplateRoutes } from "./template.routes";

export default function setAllRoutes(app: express.Express): void {
  setAccountRoutes(app);
  setAuthRoutes(app);
  setTemplateRoutes(app);
  setAuthTestRoutes(app);
}
