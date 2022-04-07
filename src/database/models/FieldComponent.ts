import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Field from "./Field";

export class FieldComponent extends Model<
  InferAttributes<FieldComponent>,
  InferCreationAttributes<FieldComponent>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare FieldId: number;
  declare Field: NonAttribute<Field>;
  declare ParentFieldId: number;
  declare ParentField: NonAttribute<Field>;

  declare static associations: {
    Field: Association<FieldComponent, Field>;
    ParentField: Association<FieldComponent, Field>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getField: BelongsToGetAssociationMixin<Field>;
  declare setField: BelongsToSetAssociationMixin<Field, number>;

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
      FieldId: {
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
