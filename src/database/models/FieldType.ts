import {
  type Association,
  type CreationOptional,
  DataTypes,
  type HasManyAddAssociationMixin,
  type HasManyAddAssociationsMixin,
  type HasManyCountAssociationsMixin,
  type HasManyCreateAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManyHasAssociationMixin,
  type HasManyHasAssociationsMixin,
  type HasManyRemoveAssociationMixin,
  type HasManyRemoveAssociationsMixin,
  type HasManySetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type Field from "./Field";
import type FieldTypeComponent from "./FieldTypeComponent";
import type Tag from "./Tag";
import { fieldTypeTypeEnum } from "../../utils/enumerators";
import { getTagIds } from "../../utils/helperFunctions";

export class FieldType extends Model<
  InferAttributes<FieldType>,
  InferCreationAttributes<FieldType>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;
  declare type?: CreationOptional<fieldTypeTypeEnum>;
  declare validator?: CreationOptional<string>;

  declare FieldTypeComponentIds?: NonAttribute<number[]>;
  declare FieldTypeComponents?: NonAttribute<FieldTypeComponent[]>;

  declare FieldIds: NonAttribute<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare TagIds: CreationOptional<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    Fields: Association<FieldType, Field>;
    FieldTypeComponents: Association<FieldType, FieldTypeComponent>;
    Tags: Association<FieldType, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getFieldTypeComponents: HasManyGetAssociationsMixin<FieldTypeComponent>;
  declare addFieldTypeComponent: HasManyAddAssociationMixin<
    FieldTypeComponent,
    number
  >;

  declare addFieldTypeComponents: HasManyAddAssociationsMixin<
    FieldTypeComponent,
    number
  >;

  declare setFieldTypeComponents: HasManySetAssociationsMixin<
    FieldTypeComponent,
    number
  >;

  declare removeFieldTypeComponent: HasManyRemoveAssociationMixin<
    FieldTypeComponent,
    number
  >;

  declare removeFieldTypeComponents: HasManyRemoveAssociationsMixin<
    FieldTypeComponent,
    number
  >;

  declare hasFieldTypeComponent: HasManyHasAssociationMixin<
    FieldTypeComponent,
    number
  >;

  declare hasFieldTypeComponents: HasManyHasAssociationsMixin<
    FieldTypeComponent,
    number
  >;

  declare countFieldTypeComponents: HasManyCountAssociationsMixin;
  declare createFieldTypeComponent: HasManyCreateAssociationMixin<
    FieldTypeComponent,
    "ParentFieldTypeId"
  >;

  declare getFields: HasManyGetAssociationsMixin<Field>;
  declare addField: HasManyAddAssociationMixin<Field, number>;
  declare addFields: HasManyAddAssociationsMixin<Field, number>;
  declare setFields: HasManySetAssociationsMixin<Field, number>;
  declare removeField: HasManyRemoveAssociationMixin<Field, number>;
  declare removeFields: HasManyRemoveAssociationsMixin<Field, number>;
  declare hasField: HasManyHasAssociationMixin<Field, number>;
  declare hasFields: HasManyHasAssociationsMixin<Field, number>;
  declare countFields: HasManyCountAssociationsMixin;
  declare createField: HasManyCreateAssociationMixin<Field, "FieldTypeId">;

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

  public async loadTagIds(): Promise<void> {
    const tagIds = await getTagIds(this);
    this.setDataValue("TagIds", tagIds);
  }

  public async loadAssociatedIds(): Promise<void> {
    const loadPromises = [this.loadTagIds()];
    await Promise.all(loadPromises);
  }
}

export function initializeFieldType(sequelize: Sequelize): void {
  FieldType.init(
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
      type: {
        type: DataTypes.ENUM({ values: Object.keys(fieldTypeTypeEnum) }),
      },
      validator: {
        type: DataTypes.STRING,
      },
      TagIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default FieldType;
