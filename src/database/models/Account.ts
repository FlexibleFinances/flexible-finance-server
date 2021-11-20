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
} from "sequelize";
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";
import Template from "./Template";
import sequelize from "../index";

interface AccountAttributes {
  name: string;
}

class Account extends Model implements AccountAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly data?: FieldDatum[];

  public readonly tags?: Tag[];

  public readonly template?: Template;

  public static override associations: {
    data: Association<Account, FieldDatum>;
    tags: Association<Account, Tag>;
    template: Association<Account, Template>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
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
    },
  },
  {
    sequelize,
  }
);

Template.hasMany(Account);
Account.belongsTo(Template);

FieldDatum.belongsTo(Account);
Account.hasMany(FieldDatum);

export default Account;
