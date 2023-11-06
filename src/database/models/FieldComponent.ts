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
import type Field from "./Field";

export class FieldComponent extends Model<
  InferAttributes<FieldComponent>,
  InferCreationAttributes<FieldComponent>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare ChildFieldId: number;
  declare ChildField: NonAttribute<Field>;
  declare ParentFieldId: number;
  declare ParentField: NonAttribute<Field>;

  declare static associations: {
    ChildField: Association<FieldComponent, Field>;
    ParentField: Association<FieldComponent, Field>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getChildField: BelongsToGetAssociationMixin<Field>;
  declare setChildField: BelongsToSetAssociationMixin<Field, number>;

  declare getParentField: BelongsToGetAssociationMixin<Field>;
  declare setParentField: BelongsToSetAssociationMixin<Field, number>;
}

export function initializeFieldComponent(sequelize: Sequelize): void {
  FieldComponent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      ChildFieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Field",
          key: "id",
        },
      },
      ParentFieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Field",
          key: "id",
        },
      },
    },
    {
      sequelize,
    }
  );
}

export default FieldComponent;
