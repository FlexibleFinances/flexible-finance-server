import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
import FieldType from "./FieldType";
import sequelize from "../index";

interface FieldAttributes {
  name: string;
}

class Field extends Model implements FieldAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly data?: FieldDatum[];

  public readonly fieldType?: FieldType;

  public static override associations: {
    data: Association<FieldDatum, Field>;
    fieldType: Association<FieldType, Field>;
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

  public getFieldType!: BelongsToGetAssociationMixin<FieldType>;
  public setFieldType!: BelongsToSetAssociationMixin<FieldType, number>;
  public createFieldType!: BelongsToCreateAssociationMixin<FieldType>;
}

Field.init(
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

Field.hasMany(FieldDatum);
FieldDatum.belongsTo(Field);

export default Field;
