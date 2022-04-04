import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Field from "./Field";
import Template from "./Template";

export class TemplateField extends Model<
  InferAttributes<TemplateField>,
  InferCreationAttributes<TemplateField>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare TemplateId: number;
  declare Template: NonAttribute<Template>;

  declare FieldId: number;
  declare Field: NonAttribute<Field>;
}

export function initializeTemplateField(sequelize: Sequelize): void {
  TemplateField.init(
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

export default TemplateField;
