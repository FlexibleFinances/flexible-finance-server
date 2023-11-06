import {
  type Association,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type FieldType from "./FieldType";

export class FieldTypeComponent extends Model<
  InferAttributes<FieldTypeComponent>,
  InferCreationAttributes<FieldTypeComponent>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare ChildFieldTypeId: number;
  declare ChildFieldType: NonAttribute<FieldType>;
  declare ParentFieldTypeId: number;
  declare ParentFieldType: NonAttribute<FieldType>;
  declare order: number;
  declare isRequired: boolean;
  declare validator?: CreationOptional<string>;

  declare static associations: {
    ChildFieldType: Association<FieldTypeComponent, FieldType>;
    ParentFieldType: Association<FieldTypeComponent, FieldType>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getChildFieldType: BelongsToGetAssociationMixin<FieldType>;
  declare setChildFieldType: BelongsToSetAssociationMixin<FieldType, number>;

  declare getParentFieldType: BelongsToGetAssociationMixin<FieldType>;
  declare setParentFieldType: BelongsToSetAssociationMixin<FieldType, number>;
}

export function initializeFieldTypeComponent(sequelize: Sequelize): void {
  FieldTypeComponent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      ChildFieldTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "FieldType",
          key: "id",
        },
      },
      ParentFieldTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "FieldType",
          key: "id",
        },
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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

export default FieldTypeComponent;
