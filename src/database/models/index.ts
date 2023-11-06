import Account, { initializeAccount } from "./Account";
import AccountField, { initializeAccountField } from "./AccountField";
import AccountTag, { initializeAccountTag } from "./AccountTag";
import Entity, { initializeEntity } from "./Entity";
import EntityField, { initializeEntityField } from "./EntityField";
import EntityTag, { initializeEntityTag } from "./EntityTag";
import Field, { initializeField } from "./Field";
import FieldChoice, { initializeFieldChoice } from "./FieldChoice";
import FieldComponent, { initializeFieldComponent } from "./FieldComponent";
import FieldDatum, { initializeFieldDatum } from "./FieldDatum";
import FieldTag, { initializeFieldTag } from "./FieldTag";
import FieldType, { initializeFieldType } from "./FieldType";
import FieldTypeComponent, {
  initializeFieldTypeComponent,
} from "./FieldTypeComponent";
import FieldTypeTag, { initializeFieldTypeTag } from "./FieldTypeTag";
import File, { initializeFile } from "./File";
import Group, { initializeGroup } from "./Group";
import GroupTag, { initializeGroupTag } from "./GroupTag";
import Report, { initializeReport } from "./Report";
import ReportTag, { initializeReportTag } from "./ReportTag";
import Role, { initializeRole } from "./Role";
import Tag, { initializeTag } from "./Tag";
import Transaction, { initializeTransaction } from "./Transaction";
import TransactionField, {
  initializeTransactionField,
} from "./TransactionField";
import TransactionFile, { initializeTransactionFile } from "./TransactionFile";
import TransactionTag, { initializeTransactionTag } from "./TransactionTag";
import Transactor, { initializeTransactor } from "./Transactor";
import TransactorType, { initializeTransactorType } from "./TransactorType";
import User, { initializeUser } from "./User";
import UserRole, { initializeUserRole } from "./UserRole";
import { type Sequelize } from "sequelize/types";

export async function syncAllModels(): Promise<void> {
  await Promise.all([
    FieldType.sync(),
    File.sync(),
    Group.sync(),
    Report.sync(),
    Role.sync(),
    Tag.sync(),
    TransactorType.sync(),
    User.sync(),
  ]);

  await Promise.all([
    Field.sync(),
    FieldTypeComponent.sync(),
    Transactor.sync(),
    UserRole.sync(),
  ]);

  await Promise.all([FieldDatum.sync()]);

  await Promise.all([Account.sync(), Entity.sync(), Transaction.sync()]);

  await Promise.all([
    AccountTag.sync(),
    EntityTag.sync(),
    FieldTag.sync(),
    FieldTypeTag.sync(),
    GroupTag.sync(),
    ReportTag.sync(),
    TransactionFile.sync(),
    TransactionTag.sync(),
  ]);
}

export function initializeModels(sequelize: Sequelize): void {
  // #region Initializations
  initializeFieldType(sequelize);
  initializeFile(sequelize);
  initializeGroup(sequelize);
  initializeReport(sequelize);
  initializeRole(sequelize);
  initializeTag(sequelize);
  initializeTransactorType(sequelize);
  initializeUser(sequelize);
  console.log("initialized model set 1");

  initializeField(sequelize);
  initializeFieldTypeComponent(sequelize);
  initializeTransactor(sequelize);
  initializeUserRole(sequelize);
  console.log("initialized model set 2");

  initializeFieldChoice(sequelize);
  initializeFieldComponent(sequelize);
  initializeAccount(sequelize);
  initializeEntity(sequelize);
  initializeTransaction(sequelize);
  console.log("initialized model set 3");

  initializeFieldDatum(sequelize);
  initializeAccountField(sequelize);
  initializeEntityField(sequelize);
  initializeTransactionField(sequelize);
  console.log("initialized model set 4");

  initializeAccountTag(sequelize);
  initializeEntityTag(sequelize);
  initializeFieldTag(sequelize);
  initializeFieldTypeTag(sequelize);
  initializeGroupTag(sequelize);
  initializeReportTag(sequelize);
  initializeTransactionFile(sequelize);
  initializeTransactionTag(sequelize);
  console.log("initialized model set 6");
  // #endregion

  // #region Account relationships
  Account.belongsTo(Account, {
    as: "Template",
    foreignKey: "TemplateId",
  });
  Account.belongsTo(Group, { as: "ParentGroup" });
  Account.belongsTo(Transactor, { foreignKey: "id" });
  Account.belongsTo(TransactorType);
  Account.belongsToMany(Tag, { through: AccountTag });
  Account.belongsToMany(Field, { through: AccountField });
  Account.hasMany(Account, { foreignKey: "TemplateId" });
  Account.hasMany(FieldDatum);
  // #endregion

  // #region Entity relationships
  Entity.belongsTo(Entity, { as: "Template", foreignKey: "TemplateId" });
  Entity.belongsTo(Group, { as: "ParentGroup" });
  Entity.belongsTo(Transactor, { foreignKey: "id" });
  Entity.belongsTo(TransactorType);
  Entity.belongsToMany(Field, { through: EntityField });
  Entity.belongsToMany(Tag, { through: EntityTag });
  Entity.hasMany(Entity, { foreignKey: "TemplateId" });
  Entity.hasMany(FieldDatum);
  // #endregion

  // #region Field relationships
  Field.belongsTo(FieldType);
  Field.belongsToMany(Account, { through: AccountField });
  Field.belongsToMany(Entity, { through: EntityField });
  Field.belongsToMany(Tag, { through: FieldTag });
  Field.belongsToMany(Transaction, { through: TransactionField });
  Field.hasMany(FieldChoice);
  Field.hasMany(FieldComponent, {
    as: "ChildFieldComponents",
    foreignKey: "ParentFieldId",
  });
  Field.hasOne(FieldComponent, {
    as: "ParentFieldComponent",
    foreignKey: "ChildFieldId",
  });
  Field.hasMany(FieldDatum);
  // #endregion

  // #region FieldChoice relationships
  FieldChoice.belongsTo(Field);
  // #endregion

  // #region FieldComponent relationships
  FieldComponent.belongsTo(Field, {
    as: "ChildField",
    foreignKey: "ChildFieldId",
  });
  FieldComponent.belongsTo(Field, {
    as: "ParentField",
    foreignKey: "ParentFieldId",
  });
  // #endregion

  // #region FieldDatum relationships
  FieldDatum.belongsTo(Account);
  FieldDatum.belongsTo(Entity);
  FieldDatum.belongsTo(Field);
  FieldDatum.belongsTo(Transaction);
  // #endregion

  // #region FieldType relationships
  FieldType.belongsToMany(Tag, { through: FieldTypeTag });
  FieldType.hasMany(Field);
  FieldType.hasMany(FieldTypeComponent, {
    as: "ChildFieldTypeComponents",
    foreignKey: "ParentFieldTypeId",
  });
  FieldType.hasOne(FieldTypeComponent, {
    as: "ParentFieldTypeComponent",
    foreignKey: "ChildFieldTypeId",
  });
  // #endregion

  // #region FieldTypeComponent relationships
  FieldTypeComponent.belongsTo(FieldType, {
    as: "ChildFieldType",
    foreignKey: "ChildFieldTypeId",
  });
  FieldTypeComponent.belongsTo(FieldType, {
    as: "ParentFieldType",
    foreignKey: "ParentFieldTypeId",
  });
  // #endregion

  // #region File relationships
  File.belongsToMany(Transaction, { through: TransactionFile });
  // #endregion

  // #region Group relationships
  Group.belongsTo(Group, { as: "ParentGroup" });
  Group.belongsToMany(Tag, { through: GroupTag });
  Group.hasMany(Account, { foreignKey: "ParentGroupId" });
  Group.hasMany(Group, { as: "ChildGroups", foreignKey: "ParentGroupId" });
  Group.hasMany(Entity, { foreignKey: "ParentGroupId" });
  // #endregion

  // #region Tag relationships
  Tag.belongsToMany(Account, { through: AccountTag });
  Tag.belongsToMany(Entity, { through: EntityTag });
  Tag.belongsToMany(Field, { through: FieldTag });
  Tag.belongsToMany(FieldType, { through: FieldTypeTag });
  Tag.belongsToMany(Group, { through: GroupTag });
  Tag.belongsToMany(Report, { through: ReportTag });
  Tag.belongsToMany(Transaction, { through: TransactionTag });
  // #endregion

  // #region Transaction relationships
  Transaction.belongsTo(Transaction, {
    as: "Template",
    foreignKey: "TemplateId",
  });
  Transaction.belongsTo(Transactor, {
    as: "RecipientTransactor",
    foreignKey: "RecipientTransactorId",
  });
  Transaction.belongsTo(Transactor, {
    as: "SourceTransactor",
    foreignKey: "SourceTransactorId",
  });
  Transaction.belongsToMany(Field, { through: TransactionField });
  Transaction.belongsToMany(File, { through: TransactionFile });
  Transaction.belongsToMany(Tag, { through: TransactionTag });
  Transaction.hasMany(FieldDatum);
  Transaction.hasMany(Transaction, { foreignKey: "TemplateId" });
  // #endregion

  // #region Transactor relationships
  Transactor.belongsTo(TransactorType);
  Transactor.hasOne(Account, { foreignKey: "id" });
  Transactor.hasOne(Entity, { foreignKey: "id" });
  Transactor.hasMany(Transaction, { foreignKey: "RecipientTransactorId" });
  Transactor.hasMany(Transaction, { foreignKey: "SourceTransactorId" });
  // #endregion

  // #region TransactorType relationships
  TransactorType.hasMany(Account);
  TransactorType.hasMany(Entity);
  TransactorType.hasMany(Transactor);
  // #endregion

  // #region Report relationships
  Report.belongsToMany(Tag, { through: ReportTag });
  // #endregion

  // #region Role relationships
  Role.belongsToMany(User, { through: UserRole });
  // #endregion

  // #region Role relationships
  User.belongsToMany(Role, { through: UserRole });
  // #endregion
}
