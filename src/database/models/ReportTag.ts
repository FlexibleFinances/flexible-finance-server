import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type Report from "./Report";
import type Tag from "./Tag";

export class ReportTag extends Model<
  InferAttributes<ReportTag>,
  InferCreationAttributes<ReportTag>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare ReportId: number;
  declare Report: NonAttribute<Report>;

  declare TagId: number;
  declare Tag: NonAttribute<Tag>;
}

export function initializeReportTag(sequelize: Sequelize): void {
  ReportTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      ReportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Report",
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

export default ReportTag;
