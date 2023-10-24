import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type Group from "./Group";
import type Tag from "./Tag";

export class GroupTag extends Model<
  InferAttributes<GroupTag>,
  InferCreationAttributes<GroupTag>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare GroupId: number;
  declare Group: NonAttribute<Group>;

  declare TagId: number;
  declare Tag: NonAttribute<Tag>;
}

export function initializeGroupTag(sequelize: Sequelize): void {
  GroupTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      GroupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Group",
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

export default GroupTag;
