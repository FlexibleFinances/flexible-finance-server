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
} from "sequelize";
import Account from "./Account";
import Tag from "./Tag";
import sequelize from "../index";

interface TemplateAttributes {
  name: string;
}

class Template extends Model implements TemplateAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly accounts?: Account[];

  public readonly tags?: Tag[];

  public static override associations: {
    accounts: Association<Template, Account>;
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
    },
  },
  {
    sequelize,
  }
);

export default Template;