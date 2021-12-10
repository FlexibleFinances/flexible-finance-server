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
import Field from "./Field";
import Tag from "./Tag";
import sequelize from "../index";
import { templateTypeEnum } from "../../app/utils/enumerators";

export interface TemplateAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  type: templateTypeEnum;
  accounts?: Account[];
  fields?: Field[];
  tags?: Tag[];
}

export interface TemplateCreationAttributes
  extends Optional<TemplateAttributes, "id">,
    Optional<TemplateAttributes, "createdAt">,
    Optional<TemplateAttributes, "updatedAt">,
    Optional<TemplateAttributes, "accounts">,
    Optional<TemplateAttributes, "fields">,
    Optional<TemplateAttributes, "tags"> {}

export class Template extends Model<
  TemplateAttributes,
  TemplateCreationAttributes
> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;
  public type!: templateTypeEnum;

  public readonly accounts?: Account[];
  public readonly fields?: Field[];
  public readonly tags?: Tag[];

  public static override associations: {
    accounts: Association<Template, Account>;
    fields: Association<Template, Field>;
    tags: Association<Template, Tag>;
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

  public getFields!: HasManyGetAssociationsMixin<Field>;
  public setFields!: HasManySetAssociationsMixin<Field, number>;
  public addField!: HasManyAddAssociationMixin<Field, number>;
  public hasField!: HasManyHasAssociationMixin<Field, number>;
  public countFields!: HasManyCountAssociationsMixin;
  public createField!: HasManyCreateAssociationMixin<Field>;

  public getTags!: HasManyGetAssociationsMixin<Tag>;
  public setTags!: HasManySetAssociationsMixin<Tag, number>;
  public addTag!: HasManyAddAssociationMixin<Tag, number>;
  public hasTag!: HasManyHasAssociationMixin<Tag, number>;
  public countTags!: HasManyCountAssociationsMixin;
  public createTag!: HasManyCreateAssociationMixin<Tag>;
}

Template.init(
  {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM({ values: Object.keys(templateTypeEnum) }),
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

export default Template;
