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
} from "sequelize";
import Tag from "./Tag";
import sequelize from "../index";

interface ReportAttributes {
  name: string;
}

export class Report extends Model implements ReportAttributes {
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
