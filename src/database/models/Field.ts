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
import FieldDatum from "./FieldDatum";
import FieldType from "./FieldType";
import Template from "./Template";

export class Field extends Model<
  InferAttributes<Field>,
  InferCreationAttributes<Field>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare FieldTypeId: number;
  declare FieldType: NonAttribute<FieldType>;

  declare Data: NonAttribute<FieldDatum[]>;
  declare Templates: NonAttribute<Template[]>;

  declare static associations: {
    Data: Association<FieldDatum, Field>;
    Templates: Association<Template, Field>;
    FieldType: Association<FieldType, Field>;
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
  declare createDatum: HasManyCreateAssociationMixin<FieldDatum, "FieldId">;

  declare getTemplates: HasManyGetAssociationsMixin<Template>;
  declare addTemplate: HasManyAddAssociationMixin<Template, number>;
  declare addTemplates: HasManyAddAssociationsMixin<Template, number>;
  declare setTemplates: HasManySetAssociationsMixin<Template, number>;
  declare removeTemplate: HasManyRemoveAssociationMixin<Template, number>;
  declare removeTemplates: HasManyRemoveAssociationsMixin<Template, number>;
  declare hasTemplate: HasManyHasAssociationMixin<Template, number>;
  declare hasTemplates: HasManyHasAssociationsMixin<Template, number>;
  declare countTemplates: HasManyCountAssociationsMixin;
  declare createTemplate: HasManyCreateAssociationMixin<Template, "id">;

  declare getFieldType: BelongsToGetAssociationMixin<FieldType>;
  declare setFieldType: BelongsToSetAssociationMixin<FieldType, number>;
}

export function initializeField(sequelize: Sequelize): void {
  Field.init(
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
      FieldTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
}

export default Field;
