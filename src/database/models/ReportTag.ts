import { Model } from "sequelize";
import Report from "./Report";
import Tag from "./Tag";
import sequelize from "..";

class ReportTag extends Model {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly reportId!: number;

  public readonly tagId!: number;
}

ReportTag.init(
  {},
  {
    sequelize,
  }
);

Report.belongsToMany(Tag, { through: ReportTag });
Tag.belongsToMany(Report, { through: ReportTag });

export default ReportTag;
