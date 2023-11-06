import {
  type Association,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
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

  declare ChildFieldTypeComponentIds?: CreationOptional<number[]>;
  declare ChildFieldTypeComponents?: NonAttribute<FieldTypeComponent[]>;

  declare FieldIds: CreationOptional<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare ParentFieldTypeComponentId?: CreationOptional<number>;
  declare ParentFieldTypeComponent?: NonAttribute<FieldTypeComponent>;

  declare TagIds: CreationOptional<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    Fields: Association<FieldType, Field>;
    ChildFieldTypeComponents: Association<FieldType, FieldTypeComponent>;
    ParentFieldTypeComponent: Association<FieldType, FieldTypeComponent>;
    Tags: Association<FieldType, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getChildFieldTypeComponents: HasManyGetAssociationsMixin<FieldTypeComponent>;
  declare addChildFieldTypeComponent: HasManyAddAssociationMixin<
    FieldTypeComponent,
    number
  >;

  declare addChildFieldTypeComponents: HasManyAddAssociationsMixin<
    FieldTypeComponent,
    number
  >;

  declare setChildFieldTypeComponents: HasManySetAssociationsMixin<
    FieldTypeComponent,
    number
  >;

  declare removeChildFieldTypeComponent: HasManyRemoveAssociationMixin<
    FieldTypeComponent,
    number
  >;

  declare removeChildFieldTypeComponents: HasManyRemoveAssociationsMixin<
    FieldTypeComponent,
    number
  >;

  declare hasChildFieldTypeComponent: HasManyHasAssociationMixin<
    FieldTypeComponent,
    number
  >;

  declare hasChildFieldTypeComponents: HasManyHasAssociationsMixin<
    FieldTypeComponent,
    number
  >;

  declare countChildFieldTypeComponents: HasManyCountAssociationsMixin;
  declare createChildFieldTypeComponent: HasManyCreateAssociationMixin<
    FieldTypeComponent,
    "ParentFieldTypeId"
  >;

  declare getParentFieldTypeComponent: BelongsToGetAssociationMixin<FieldTypeComponent>;
  declare setParentFieldTypeComponent: BelongsToSetAssociationMixin<
    FieldTypeComponent,
    number
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
      ChildFieldTypeComponentIds: DataTypes.VIRTUAL,
      FieldIds: DataTypes.VIRTUAL,
      ParentFieldTypeComponentId: DataTypes.VIRTUAL,
      TagIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default FieldType;
