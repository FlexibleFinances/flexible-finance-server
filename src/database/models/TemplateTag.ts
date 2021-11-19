import { Model } from "sequelize";
import Tag from "./Tag";
import Template from "./Template";
import sequelize from "..";

class TemplateTag extends Model {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly templateId!: number;

  public readonly tagId!: number;
}

TemplateTag.init(
  {},
  {
    sequelize,
  }
);

Template.belongsToMany(Tag, { through: TemplateTag });
Tag.belongsToMany(Template, { through: TemplateTag });

export default TemplateTag;
