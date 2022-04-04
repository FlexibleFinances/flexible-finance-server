import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Entity from "./Entity";
import Tag from "./Tag";

export class EntityTag extends Model<
  InferAttributes<EntityTag>,
  InferCreationAttributes<EntityTag>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare EntityId: number;
  declare Entity: NonAttribute<Entity>;

  declare TagId: number;
  declare Tag: NonAttribute<Tag>;
}

export function initializeEntityTag(sequelize: Sequelize): void {
  EntityTag.init(
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

export default EntityTag;
