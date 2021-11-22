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
import Field from "./Field";
import sequelize from "../index";

interface FieldTypeAttributes {
  name: string;
}

class FieldType extends Model implements FieldTypeAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly tags?: Field[];

  public static override associations: {
    fields: Association<FieldType, Field>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getFields!: HasManyGetAssociationsMixin<Field>;
  public setFields!: HasManySetAssociationsMixin<Field, number>;
  public addField!: HasManyAddAssociationMixin<Field, number>;
  public hasField!: HasManyHasAssociationMixin<Field, number>;
  public countFields!: HasManyCountAssociationsMixin;
  public createField!: HasManyCreateAssociationMixin<Field>;
}

FieldType.init(
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

FieldType.hasMany(Field);
Field.belongsTo(FieldType);

export default FieldType;
