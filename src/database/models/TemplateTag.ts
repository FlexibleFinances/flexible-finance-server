import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Tag from "./Tag";
import Template from "./Template";

export class TemplateTag extends Model<
  InferAttributes<TemplateTag>,
  InferCreationAttributes<TemplateTag>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare TemplateId: number;
  declare Template: NonAttribute<Template>;

  declare TagId: number;
  declare Tag: NonAttribute<Tag>;
}

export function initializeTemplateTag(sequelize: Sequelize): void {
  TemplateTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      TemplateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Template",
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

export default TemplateTag;
