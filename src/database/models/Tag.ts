import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  Model,
  Optional,
} from "sequelize";
import Account from "./Account";
import Entity from "./Entity";
import Report from "./Report";
import Template from "./Template";
import Transaction from "./Transaction";
import sequelize from "../index";

export interface TagAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  accounts?: Account[];
  entities?: Entity[];
  reports?: Report[];
  templates?: Template[];
  transactions?: Transaction[];
}

export interface TagCreationAttributes
  extends Optional<TagAttributes, "id">,
    Optional<TagAttributes, "createdAt">,
    Optional<TagAttributes, "updatedAt">,
    Optional<TagAttributes, "accounts">,
    Optional<TagAttributes, "entities">,
    Optional<TagAttributes, "reports">,
    Optional<TagAttributes, "templates">,
    Optional<TagAttributes, "transactions"> {}

export class Tag extends Model<TagAttributes, TagCreationAttributes> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly accounts?: Account[];

  public readonly entities?: Entity[];

  public readonly reports?: Report[];

  public readonly templates?: Template[];

  public readonly transactions?: Transaction[];

  public static override associations: {
    accounts: Association<Account, Tag>;
    entities: Association<Entity, Tag>;
    reports: Association<Report, Tag>;
    templates: Association<Template, Tag>;
    transactions: Association<Transaction, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getAccounts!: HasManyGetAssociationsMixin<Account>;
  public setAccounts!: HasManySetAssociationsMixin<Account, number>;
  public addAccount!: HasManyAddAssociationMixin<Account, number>;
  public hasAccount!: HasManyHasAssociationMixin<Account, number>;
  public countAccounts!: HasManyCountAssociationsMixin;
  public createAccount!: HasManyCreateAssociationMixin<Account>;

  public getEntities!: HasManyGetAssociationsMixin<Entity>;
  public setEntities!: HasManySetAssociationsMixin<Entity, number>;
  public addEntity!: HasManyAddAssociationMixin<Entity, number>;
  public hasEntity!: HasManyHasAssociationMixin<Entity, number>;
  public countEntities!: HasManyCountAssociationsMixin;
  public createEntity!: HasManyCreateAssociationMixin<Entity>;

  public getReports!: HasManyGetAssociationsMixin<Report>;
  public setReports!: HasManySetAssociationsMixin<Report, number>;
  public addReport!: HasManyAddAssociationMixin<Report, number>;
  public hasReport!: HasManyHasAssociationMixin<Report, number>;
  public countReports!: HasManyCountAssociationsMixin;
  public createReport!: HasManyCreateAssociationMixin<Report>;

  public getTemplates!: HasManyGetAssociationsMixin<Template>;
  public setTemplates!: HasManySetAssociationsMixin<Template, number>;
  public addTemplate!: HasManyAddAssociationMixin<Template, number>;
  public hasTemplate!: HasManyHasAssociationMixin<Template, number>;
  public countTemplates!: HasManyCountAssociationsMixin;
  public createTemplate!: HasManyCreateAssociationMixin<Template>;

  public getTransactions!: HasManyGetAssociationsMixin<Transaction>;
  public setTransactions!: HasManySetAssociationsMixin<Transaction, number>;
  public addTransaction!: HasManyAddAssociationMixin<Transaction, number>;
  public hasTransaction!: HasManyHasAssociationMixin<Transaction, number>;
  public countTransaction!: HasManyCountAssociationsMixin;
  public createTransaction!: HasManyCreateAssociationMixin<Transaction>;
}

Tag.init(
  {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
  }
);

export default Tag;
