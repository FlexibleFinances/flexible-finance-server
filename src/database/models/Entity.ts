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
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";
import sequelize from "../index";

interface EntityAttributes {
  name: string;
}

export class Entity extends Model implements EntityAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly data?: FieldDatum[];

  public readonly tags?: Tag[];

  public static override associations: {
    data: Association<Entity, FieldDatum>;
    tags: Association<Entity, Tag>;
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
}

Entity.init(
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

FieldDatum.belongsTo(Entity);
Entity.hasMany(FieldDatum);

export default Entity;