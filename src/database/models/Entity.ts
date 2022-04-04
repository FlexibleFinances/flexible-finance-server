import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";

export class Entity extends Model<
  InferAttributes<Entity>,
  InferCreationAttributes<Entity>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare Data: NonAttribute<FieldDatum[]>;

  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    Data: Association<Entity, FieldDatum>;
    Tags: Association<Entity, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getData: HasManyGetAssociationsMixin<FieldDatum>;
  declare addDatum: HasManyAddAssociationMixin<FieldDatum, number>;
  declare addData: HasManyAddAssociationsMixin<FieldDatum, number>;
  declare setData: HasManySetAssociationsMixin<FieldDatum, number>;
  declare removeDatum: HasManyRemoveAssociationMixin<FieldDatum, number>;
  declare removeData: HasManyRemoveAssociationsMixin<FieldDatum, number>;
  declare hasDatum: HasManyHasAssociationMixin<FieldDatum, number>;
  declare hasData: HasManyHasAssociationsMixin<FieldDatum, number>;
  declare countData: HasManyCountAssociationsMixin;
  declare createDatum: HasManyCreateAssociationMixin<FieldDatum, "EntityId">;

  declare getTags: HasManyGetAssociationsMixin<Tag>;
  declare addTag: HasManyAddAssociationMixin<Tag, number>;
  declare addTags: HasManyAddAssociationsMixin<Tag, number>;
  declare setTags: HasManySetAssociationsMixin<Tag, number>;
  declare removeTag: HasManyRemoveAssociationMixin<Tag, number>;
  declare removeTags: HasManyRemoveAssociationsMixin<Tag, number>;
  declare hasTag: HasManyHasAssociationMixin<Tag, number>;
  declare hasTags: HasManyHasAssociationsMixin<Tag, number>;
  declare countTags: HasManyCountAssociationsMixin;
  declare createTag: HasManyCreateAssociationMixin<Tag, "id">;
}

export function initializeEntity(sequelize: Sequelize): void {
  Entity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
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
}

export default Entity;
