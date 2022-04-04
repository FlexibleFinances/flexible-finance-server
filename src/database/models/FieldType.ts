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

export class FieldType extends Model<
  InferAttributes<FieldType>,
  InferCreationAttributes<FieldType>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare Fields: NonAttribute<Field[]>;

  declare static associations: {
    Fields: Association<FieldType, Field>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
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
    },
    {
      sequelize,
    }
  );
}

export default FieldType;
