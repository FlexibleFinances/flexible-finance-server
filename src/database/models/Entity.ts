import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
import Field from "./Field";
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";
import Template from "./Template";

export class Entity extends Model<
  InferAttributes<Entity>,
  InferCreationAttributes<Entity>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare TemplateId: number;
  declare Template: NonAttribute<Template>;

  declare FieldIds: CreationOptional<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare FieldDatumIds: CreationOptional<number[]>;
  declare FieldData: NonAttribute<FieldDatum[]>;

  declare TagIds: NonAttribute<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    Fields: Association<Entity, Field>;
    FieldData: Association<Entity, FieldDatum>;
    Tags: Association<Entity, Tag>;
    Template: Association<Entity, Template>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTemplate: BelongsToGetAssociationMixin<Template>;
  declare setTemplate: BelongsToSetAssociationMixin<Template, number>;

  declare getFieldData: HasManyGetAssociationsMixin<FieldDatum>;
  declare addFieldDatum: HasManyAddAssociationMixin<FieldDatum, number>;
  declare addFieldData: HasManyAddAssociationsMixin<FieldDatum, number>;
  declare setFieldData: HasManySetAssociationsMixin<FieldDatum, number>;
  declare removeFieldDatum: HasManyRemoveAssociationMixin<FieldDatum, number>;
  declare removeFieldData: HasManyRemoveAssociationsMixin<FieldDatum, number>;
  declare hasFieldDatum: HasManyHasAssociationMixin<FieldDatum, number>;
  declare hasFieldData: HasManyHasAssociationsMixin<FieldDatum, number>;
  declare countFieldData: HasManyCountAssociationsMixin;
  declare createFieldDatum: HasManyCreateAssociationMixin<
    FieldDatum,
    "EntityId"
  >;

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

  public async setFieldDatumAndFieldIds(): Promise<Entity> {
    this.setDataValue("FieldDatumIds", []);
    this.setDataValue("FieldIds", []);
    const accountData = await this.getFieldData();
    accountData.forEach((datum) => {
      const fieldDatumIds = this.getDataValue("FieldDatumIds");
      fieldDatumIds.push(datum.id);
      this.setDataValue("FieldDatumIds", fieldDatumIds);
      const fieldIds = this.getDataValue("FieldIds");
      fieldIds.push(datum.id);
      this.setDataValue("FieldIds", fieldDatumIds);
    });
    return this;
  }
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
      TemplateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Template",
          key: "id",
        },
      },
      FieldIds: DataTypes.VIRTUAL,
      FieldDatumIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default Entity;
