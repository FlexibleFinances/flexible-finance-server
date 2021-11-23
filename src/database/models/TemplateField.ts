import Field from "./Field";
import { Model } from "sequelize";
import Template from "./Template";
import sequelize from "../index";

export class TemplateField extends Model {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly templateId!: number;

  public readonly fieldId!: number;
}

TemplateField.init(
  {},
  {
    sequelize,
  }
);

Field.belongsToMany(Template, { through: TemplateField });
Template.belongsToMany(Field, { through: TemplateField });

export default TemplateField;
