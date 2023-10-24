import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type FieldType from "./FieldType";
import type Tag from "./Tag";

export class FieldTypeTag extends Model<
  InferAttributes<FieldTypeTag>,
  InferCreationAttributes<FieldTypeTag>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare FieldTypeId: number;
  declare FieldType: NonAttribute<FieldType>;

  declare TagId: number;
  declare Tag: NonAttribute<Tag>;
}

export function initializeFieldTypeTag(sequelize: Sequelize): void {
  FieldTypeTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      FieldTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "FieldType",
          key: "id",
        },
      },
      TagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tag",
          key: "id",
        },
      },
    },
    {
      sequelize,
    }
  );
}

export default FieldTypeTag;
