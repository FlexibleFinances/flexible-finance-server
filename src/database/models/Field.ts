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
  Optional,
} from "sequelize";
import FieldDatum from "./FieldDatum";
import FieldType from "./FieldType";
import Template from "./Template";
import sequelize from "../index";

export interface FieldAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  fieldType: FieldType;
  data?: FieldDatum[];
  templates?: Template[];
}

export interface FieldCreationAttributes
  extends Optional<FieldAttributes, "id">,
    Optional<FieldAttributes, "createdAt">,
    Optional<FieldAttributes, "updatedAt">,
    Optional<FieldAttributes, "data">,
    Optional<FieldAttributes, "templates"> {}

export interface FieldUpdateAttributes {
  name?: string;
  fieldType?: FieldType;
  data?: FieldDatum[];
  templates?: Template[];
}

export class Field extends Model<FieldAttributes, FieldCreationAttributes> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly fieldType!: FieldType;

  public readonly data?: FieldDatum[];
  public readonly templates?: Template[];

  public static override associations: {
    data: Association<FieldDatum, Field>;
    templates: Association<Template, Field>;
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

  public getTemplates!: HasManyGetAssociationsMixin<Template>;
  public setTemplates!: HasManySetAssociationsMixin<Template, number>;
  public addTemplate!: HasManyAddAssociationMixin<Template, number>;
  public hasTemplate!: HasManyHasAssociationMixin<Template, number>;
  public countTemplates!: HasManyCountAssociationsMixin;
  public createTemplate!: HasManyCreateAssociationMixin<Template>;

  public getFieldType!: BelongsToGetAssociationMixin<FieldType>;
  public setFieldType!: BelongsToSetAssociationMixin<FieldType, number>;
  public createFieldType!: BelongsToCreateAssociationMixin<FieldType>;
}

Field.init(
  {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    fieldType: {
      type: DataTypes.INTEGER,
      references: {
        model: "FieldType",
        key: "id",
      },
    },
  },
  {
    sequelize,
  }
);

Field.hasMany(FieldDatum);
FieldDatum.belongsTo(Field);

export default Field;
