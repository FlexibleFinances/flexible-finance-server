import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  Model,
  Optional,
} from "sequelize";
import Tag from "./Tag";
import sequelize from "../index";

export interface ReportAttributes {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  tags?: Tag[];
}

export interface ReportCreationAttributes
  extends Optional<ReportAttributes, "id">,
    Optional<ReportAttributes, "createdAt">,
    Optional<ReportAttributes, "updatedAt">,
    Optional<ReportAttributes, "tags"> {}

export class Report extends Model<ReportAttributes, ReportCreationAttributes> {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;

  public readonly tags?: Tag[];

  public static override associations: {
    tags: Association<Report, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getTags!: HasManyGetAssociationsMixin<Tag>;
  public setTags!: HasManySetAssociationsMixin<Tag, number>;
  public addTag!: HasManyAddAssociationMixin<Tag, number>;
  public hasTag!: HasManyHasAssociationMixin<Tag, number>;
  public countTags!: HasManyCountAssociationsMixin;
  public createTag!: HasManyCreateAssociationMixin<Tag>;
}

Report.init(
  {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
  }
);

export default Report;
