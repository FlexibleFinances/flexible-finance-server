import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type Entity from "./Entity";
import type Field from "./Field";

export class EntityField extends Model<
  InferAttributes<EntityField>,
  InferCreationAttributes<EntityField>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare EntityId: number;
  declare Entity: NonAttribute<Entity>;

  declare FieldId: number;
  declare Field: NonAttribute<Field>;
}

export function initializeEntityField(sequelize: Sequelize): void {
  EntityField.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      EntityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Entity",
          key: "id",
        },
      },
      FieldId: {
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

export default EntityField;
