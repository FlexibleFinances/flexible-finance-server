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
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";
import sequelize from "../index";

export interface EntityAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  data?: FieldDatum[];
  tags?: Tag[];
}

export interface EntityCreationAttributes
  extends Optional<EntityAttributes, "id">,
    Optional<EntityAttributes, "createdAt">,
    Optional<EntityAttributes, "updatedAt">,
    Optional<EntityAttributes, "data">,
    Optional<EntityAttributes, "tags"> {}

export interface EntityUpdateAttributes {
  name?: string;
  data?: FieldDatum[];
  tags?: Tag[];
}

export class Entity extends Model<EntityAttributes, EntityCreationAttributes> {
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
      unique: true,
    },
  },
  {
    sequelize,
  }
);

FieldDatum.belongsTo(Entity);
Entity.hasMany(FieldDatum);

export default Entity;
