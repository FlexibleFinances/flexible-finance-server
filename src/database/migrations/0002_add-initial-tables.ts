import { Account } from "../models/Account";
import { AccountGroup } from "../models/AccountGroup";
import { AccountTag } from "../models/AccountTag";
import { Entity } from "../models/Entity";
import { EntityTag } from "../models/EntityTag";
import { File } from "../models/File";
import { Report } from "../models/Report";
import { ReportTag } from "../models/ReportTag";
import { Status } from "../models/Status";
import { Tag } from "../models/Tag";
import { Template } from "../models/Template";
import { TemplateTag } from "../models/TemplateTag";
import { Transaction } from "../models/Transaction";
import { TransactionFile } from "../models/TransactionFile";
import { TransactionTag } from "../models/TransactionTag";
import { Type } from "../models/Type";
import sequelize from "../index";

export async function up(): Promise<void> {
  await Promise.all([
    Account.sync(),
    AccountGroup.sync(),
    Entity.sync(),
    File.sync(),
    Report.sync(),
    Status.sync(),
    Tag.sync(),
    Template.sync(),
    Transaction.sync(),
    Type.sync(),
  ]);
  await Promise.all([
    AccountTag.sync(),
    EntityTag.sync(),
    ReportTag.sync(),
    TemplateTag.sync(),
    TransactionFile.sync(),
    TransactionTag.sync(),
  ]);
  console.log("0002 up");
}

export async function down(): Promise<void> {
  await sequelize.getQueryInterface().dropTable("AccountTags");
  await sequelize.getQueryInterface().dropTable("EntityTags");
  await sequelize.getQueryInterface().dropTable("ReportTags");
  await sequelize.getQueryInterface().dropTable("TemplateTags");
  await sequelize.getQueryInterface().dropTable("TransactionFiles");
  await sequelize.getQueryInterface().dropTable("TransactionTags");
  await sequelize.getQueryInterface().dropTable("Accounts");
  await sequelize.getQueryInterface().dropTable("AccountGroups");
  await sequelize.getQueryInterface().dropTable("Entities");
  await sequelize.getQueryInterface().dropTable("Files");
  await sequelize.getQueryInterface().dropTable("Reports");
  await sequelize.getQueryInterface().dropTable("Tags");
  await sequelize.getQueryInterface().dropTable("Templates");
  await sequelize.getQueryInterface().dropTable("Transactions");
  await sequelize.getQueryInterface().dropTable("Statuses");
  await sequelize.getQueryInterface().dropTable("Types");
  console.log("0002 down");
}
