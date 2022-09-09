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
import FieldType, { initializeFieldType } from "./FieldType";
import FieldTypeComponent, {
  initializeFieldTypeComponent,
} from "./FieldTypeComponent";
import File, { initializeFile } from "./File";
import Group, { initializeGroup } from "./Group";
import Report, { initializeReport } from "./Report";
import ReportTag, { initializeReportTag } from "./ReportTag";
import Role, { initializeRole } from "./Role";
import Status, { initializeStatus } from "./Status";
import Tag, { initializeTag } from "./Tag";
import Transaction, { initializeTransaction } from "./Transaction";
import TransactionField, {
  initializeTransactionField,
} from "./TransactionField";
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
    FieldType.sync(),
    File.sync(),
    Group.sync(),
    Report.sync(),
    Role.sync(),
    Status.sync(),
    Tag.sync(),
    TransactorType.sync(),
    Type.sync(),
    User.sync(),
  ]);

  await Promise.all([
    Field.sync(),
    FieldTypeComponent.sync(),
    ReportTag.sync(),
    Transactor.sync(),
    UserRole.sync(),
  ]);

  await Promise.all([FieldDatum.sync()]);

  await Promise.all([Account.sync(), Entity.sync(), Transaction.sync()]);

  await Promise.all([
    EntityTag.sync(),
    TransactionFile.sync(),
    TransactionTag.sync(),
  ]);
}

export function initializeModels(sequelize: Sequelize): void {
  initializeFieldType(sequelize);
  initializeFile(sequelize);
  initializeGroup(sequelize);
  initializeReport(sequelize);
  initializeRole(sequelize);
  initializeStatus(sequelize);
  initializeTag(sequelize);
  initializeTransactorType(sequelize);
  initializeType(sequelize);
  initializeUser(sequelize);
  console.log("initialized model set 1");

  initializeField(sequelize);
  initializeFieldTypeComponent(sequelize);
  initializeReportTag(sequelize);
  initializeTransactor(sequelize);
  initializeUserRole(sequelize);
  console.log("initialized model set 2");

  initializeFieldChoice(sequelize);
  initializeFieldComponent(sequelize);
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
  initializeAccountField(sequelize);
  initializeEntityField(sequelize);
  initializeTransactionField(sequelize);
  console.log("initialized model set 5");

  Account.belongsTo(Group);
  Group.hasMany(Account);

  Account.belongsTo(Account, { foreignKey: "TemplateId" });
  Account.hasMany(Account, { foreignKey: "TemplateId" });

  Account.belongsTo(Transactor, { foreignKey: "id" });
  Transactor.hasOne(Account, { foreignKey: "id" });

  Account.belongsTo(TransactorType);
  TransactorType.hasMany(Account);

  FieldDatum.belongsTo(Account);
  Account.hasMany(FieldDatum);

  Account.belongsToMany(Tag, { through: AccountTag });
  Tag.belongsToMany(Account, { through: AccountTag });

  Account.belongsToMany(Field, { through: AccountField });
  Field.belongsToMany(Account, { through: AccountField });

  Entity.belongsTo(Group);
  Group.hasMany(Entity);

  Entity.belongsTo(Entity, { foreignKey: "TemplateId" });
  Entity.hasMany(Entity, { foreignKey: "TemplateId" });

  Entity.belongsTo(Transactor, { foreignKey: "id" });
  Transactor.hasOne(Entity, { foreignKey: "id" });

  Entity.belongsTo(TransactorType);
  TransactorType.hasMany(Entity);

  FieldDatum.belongsTo(Entity);
  Entity.hasMany(FieldDatum);

  Entity.belongsToMany(Tag, { through: EntityTag });
  Tag.belongsToMany(Entity, { through: EntityTag });

  Entity.belongsToMany(Field, { through: EntityField });
  Field.belongsToMany(Entity, { through: EntityField });

  Transaction.belongsTo(Transaction, { foreignKey: "TemplateId" });
  Transaction.hasMany(Transaction, { foreignKey: "TemplateId" });

  FieldDatum.belongsTo(Transaction);
  Transaction.hasMany(FieldDatum);

  Transaction.belongsToMany(File, { through: TransactionFile });
  File.belongsToMany(Transaction, { through: TransactionFile });

  Transaction.belongsToMany(Tag, { through: TransactionTag });
  Tag.belongsToMany(Transaction, { through: TransactionTag });

  Transaction.belongsToMany(Field, { through: TransactionField });
  Field.belongsToMany(Transaction, { through: TransactionField });

  Transaction.belongsTo(Transactor, {
    as: "SourceTransactor",
    foreignKey: "SourceTransactorId",
  });
  Transactor.hasMany(Transaction, { foreignKey: "SourceTransactorId" });

  Transaction.belongsTo(Transactor, {
    as: "RecipientTransactor",
    foreignKey: "RecipientTransactorId",
  });
  Transactor.hasMany(Transaction, { foreignKey: "RecipientTransactorId" });

  Transactor.belongsTo(TransactorType);
  TransactorType.hasMany(Transactor);

  Report.belongsToMany(Tag, { through: ReportTag });
  Tag.belongsToMany(Report, { through: ReportTag });

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

  User.belongsToMany(Role, { through: UserRole });
  Role.belongsToMany(User, { through: UserRole });
}
