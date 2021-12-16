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
import Field from "./Field";
import sequelize from "../index";

export interface FieldTypeAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  fields?: Field[];
}

export interface FieldTypeCreationAttributes
  extends Optional<FieldTypeAttributes, "id">,
    Optional<FieldTypeAttributes, "createdAt">,
    Optional<FieldTypeAttributes, "updatedAt">,
    Optional<FieldTypeAttributes, "fields"> {}

export interface FieldTypeUpdateAttributes {
  name?: string;
  fields?: Field[];
}

export class FieldType extends Model<
  FieldTypeAttributes,
  FieldTypeCreationAttributes
> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly fields?: Field[];

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
