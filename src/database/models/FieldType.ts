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
import Field from "./Field";
import FieldTypeComponent from "./FieldTypeComponent";
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

  declare FieldTypeComponentIds?: NonAttribute<number[]>;
  declare FieldTypeComponents?: NonAttribute<FieldTypeComponent[]>;

  declare FieldIds: NonAttribute<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare static associations: {
    Fields: Association<FieldType, Field>;
    FieldTypeComponents: Association<FieldType, FieldTypeComponent>;
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
    },
    {
      sequelize,
    }
  );
}

export default FieldType;
