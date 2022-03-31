import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  Model,
  Optional,
  WhereAttributeHash,
} from "sequelize";
import AccountGroup from "./AccountGroup";
import Field from "./Field";
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";
import Template from "./Template";
import sequelize from "../index";

export interface AccountAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  fields?: Field[] | number[];
  accountGroup?: AccountGroup | number;
  data?: FieldDatum[] | number[];
  tags?: Tag[] | number[];
  template: Template | number;
}

export interface AccountCreationAttributes
  extends Optional<AccountAttributes, "id">,
    Optional<AccountAttributes, "createdAt">,
    Optional<AccountAttributes, "updatedAt">,
    Optional<AccountAttributes, "fields">,
    Optional<AccountAttributes, "accountGroup">,
    Optional<AccountAttributes, "data">,
    Optional<AccountAttributes, "tags"> {}

export interface AccountUpdateAttributes {
  name?: string;
  fields?: Field[] | number[];
  accountGroup?: AccountGroup | number;
  data?: FieldDatum[] | number[];
  tags?: Tag[] | number[];
  template?: Template | number;
}

export class Account extends Model<
  AccountAttributes,
  AccountCreationAttributes
> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public fields?: Field[];

  public readonly accountGroup?: AccountGroup;
  public readonly data?: FieldDatum[];
  public readonly tags?: Tag[];
  public readonly template!: Template;

  public static override associations: {
    accountGroup: Association<Account, AccountGroup>;
    data: Association<Account, FieldDatum>;
    tags: Association<Account, Tag>;
    template: Association<Account, Template>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getAccountGroup!: BelongsToGetAssociationMixin<AccountGroup>;
  public setAccountGroup!: BelongsToSetAssociationMixin<AccountGroup, number>;
  public createAccountGroup!: BelongsToCreateAssociationMixin<AccountGroup>;

  public getData!: HasManyGetAssociationsMixin<FieldDatum>;
  public setData!: HasManySetAssociationsMixin<FieldDatum, number>;
  public addDatum!: HasManyAddAssociationMixin<FieldDatum, number>;
  public hasDatum!: HasManyHasAssociationMixin<FieldDatum, number>;
  public countData!: HasManyCountAssociationsMixin;
  public createDatum!: HasManyCreateAssociationMixin<FieldDatum>;

  public getTags!: HasManyGetAssociationsMixin<Tag>;
  public setTags!: HasManySetAssociationsMixin<Tag, number>;
  public addTag!: HasManyAddAssociationMixin<Tag, number>;
  public hasTag!: HasManyHasAssociationMixin<Tag, number>;
  public countTags!: HasManyCountAssociationsMixin;
  public createTag!: HasManyCreateAssociationMixin<Tag>;

  public getTemplate!: BelongsToGetAssociationMixin<Template>;
  public setTemplate!: BelongsToSetAssociationMixin<Template, number>;
  public createTemplate!: BelongsToCreateAssociationMixin<Template>;
}

Account.init(
  {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    template: {
      type: DataTypes.INTEGER,
      field: "TemplateId",
      references: {
        model: "Template",
        key: "id",
      },
    },
  },
  {
    sequelize,
  }
);

Account.belongsTo(AccountGroup);
AccountGroup.hasMany(Account);

Account.belongsTo(Template);
Template.hasMany(Account);

FieldDatum.belongsTo(Account);
Account.hasMany(FieldDatum);

export default Account;

export interface AccountWhereAttributes extends WhereAttributeHash {
  accountGroup?: number;
}
