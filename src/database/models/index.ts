import Account, { initializeAccount } from "./Account";
import AccountGroup, { initializeAccountGroup } from "./AccountGroup";
import AccountTag, { initializeAccountTag } from "./AccountTag";
import Entity, { initializeEntity } from "./Entity";
import EntityTag, { initializeEntityTag } from "./EntityTag";
import Field, { initializeField } from "./Field";
import FieldChoice, { initializeFieldChoice } from "./FieldChoice";
import FieldComponent, { initializeFieldComponent } from "./FieldComponent";
import FieldDatum, { initializeFieldDatum } from "./FieldDatum";
import FieldType, { initializeFieldType } from "./FieldType";
import FieldTypeComponent, {
  initializeFieldTypeComponent,
} from "./FieldTypeComponent";
import File, { initializeFile } from "./File";
import Report, { initializeReport } from "./Report";
import ReportTag, { initializeReportTag } from "./ReportTag";
import Role, { initializeRole } from "./Role";
import Status, { initializeStatus } from "./Status";
import Tag, { initializeTag } from "./Tag";
import Template, { initializeTemplate } from "./Template";
import TemplateField, { initializeTemplateField } from "./TemplateField";
import TemplateTag, { initializeTemplateTag } from "./TemplateTag";
import Transaction, { initializeTransaction } from "./Transaction";
import TransactionFile, { initializeTransactionFile } from "./TransactionFile";
import TransactionTag, { initializeTransactionTag } from "./TransactionTag";
import Transactor, { initializeTransactor } from "./Transactor";
import TransactorType, { initializeTransactorType } from "./TransactorType";
import Type, { initializeType } from "./Type";
import User, { initializeUser } from "./User";
import UserRole, { initializeUserRole } from "./UserRole";
import { Sequelize } from "sequelize/types";

export async function syncAllModels(): Promise<void> {
  await Promise.all([
    AccountGroup.sync(),
    FieldType.sync(),
    File.sync(),
    Report.sync(),
    Role.sync(),
    Status.sync(),
    Tag.sync(),
    Template.sync(),
    TransactorType.sync(),
    Type.sync(),
    User.sync(),
  ]);

  await Promise.all([
    Field.sync(),
    FieldTypeComponent.sync(),
    ReportTag.sync(),
    TemplateTag.sync(),
    Transactor.sync(),
    UserRole.sync(),
  ]);

  await Promise.all([FieldDatum.sync(), TemplateField.sync()]);

  await Promise.all([Entity.sync(), Transaction.sync()]);

  await Promise.all([
    Account.sync(),
    EntityTag.sync(),
    TransactionFile.sync(),
    TransactionTag.sync(),
  ]);
}

export function initializeModels(sequelize: Sequelize): void {
  initializeAccountGroup(sequelize);
  initializeFieldType(sequelize);
  initializeFile(sequelize);
  initializeReport(sequelize);
  initializeRole(sequelize);
  initializeStatus(sequelize);
  initializeTag(sequelize);
  initializeTemplate(sequelize);
  initializeTransactorType(sequelize);
  initializeType(sequelize);
  initializeUser(sequelize);
  console.log("initialized model set 1");

  initializeField(sequelize);
  initializeFieldTypeComponent(sequelize);
  initializeReportTag(sequelize);
  initializeTemplateTag(sequelize);
  initializeTransactor(sequelize);
  initializeUserRole(sequelize);
  console.log("initialized model set 2");

  initializeFieldChoice(sequelize);
  initializeFieldComponent(sequelize);
  initializeTemplateField(sequelize);
  initializeEntity(sequelize);
  initializeTransaction(sequelize);
  console.log("initialized model set 3");

  initializeAccount(sequelize);
  initializeEntityTag(sequelize);
  initializeTransactionFile(sequelize);
  initializeTransactionTag(sequelize);
  console.log("initialized model set 4");

  initializeAccountTag(sequelize);
  initializeFieldDatum(sequelize);
  console.log("initialized model set 5");

  Account.belongsTo(AccountGroup);
  AccountGroup.hasMany(Account);

  Account.belongsTo(Template);
  Template.hasMany(Account);

  Account.belongsTo(Transactor, { foreignKey: "id" });
  Transactor.hasOne(Account, { foreignKey: "id" });

  Account.belongsTo(TransactorType);
  TransactorType.hasMany(Account);

  FieldTypeComponent.belongsTo(FieldType);
  FieldType.hasMany(FieldTypeComponent);

  FieldTypeComponent.belongsTo(FieldType, {
    as: "ParentFieldType",
    foreignKey: "ParentFieldTypeId",
  });
  FieldType.hasMany(FieldTypeComponent);

  Field.belongsTo(FieldType);
  FieldType.hasMany(Field);

  FieldChoice.belongsTo(Field);
  Field.hasMany(FieldChoice);

  FieldComponent.belongsTo(Field);
  Field.hasMany(FieldComponent);

  FieldComponent.belongsTo(Field, {
    as: "ParentField",
    foreignKey: "ParentFieldId",
  });
  Field.hasMany(FieldComponent);

  FieldDatum.belongsTo(Account);
  Account.hasMany(FieldDatum);

  FieldDatum.belongsTo(Entity);
  Entity.hasMany(FieldDatum);

  FieldDatum.belongsTo(Transaction);
  Transaction.hasMany(FieldDatum);

  Account.belongsToMany(Tag, { through: AccountTag });
  Tag.belongsToMany(Account, { through: AccountTag });

  Entity.belongsTo(Template);
  Template.hasMany(Entity);

  Entity.belongsTo(Transactor, { foreignKey: "id" });
  Transactor.hasOne(Entity, { foreignKey: "id" });

  Entity.belongsTo(TransactorType);
  TransactorType.hasMany(Entity);

  Entity.belongsToMany(Tag, { through: EntityTag });
  Tag.belongsToMany(Entity, { through: EntityTag });

  Report.belongsToMany(Tag, { through: ReportTag });
  Tag.belongsToMany(Report, { through: ReportTag });

  Template.belongsToMany(Field, { through: TemplateField });
  Field.belongsToMany(Template, { through: TemplateField });

  Template.belongsToMany(Tag, { through: TemplateTag });
  Tag.belongsToMany(Template, { through: TemplateTag });

  Transaction.belongsToMany(File, { through: TransactionFile });
  File.belongsToMany(Transaction, { through: TransactionFile });

  Transaction.belongsToMany(Tag, { through: TransactionTag });
  Tag.belongsToMany(Transaction, { through: TransactionTag });

  Transaction.belongsTo(Transactor, {
    as: "SourceTransactor",
    foreignKey: "SourceTransactorId",
  });
  Transaction.belongsTo(Transactor, {
    as: "DestinationTransactor",
    foreignKey: "DestinationTransactorId",
  });
  Transactor.hasMany(Transaction);

  Transactor.belongsTo(TransactorType);
  TransactorType.hasMany(Transactor);

  User.belongsToMany(Role, { through: UserRole });
  Role.belongsToMany(User, { through: UserRole });
}
