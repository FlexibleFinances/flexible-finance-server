import { Entity } from "./Entity";
import { Model } from "sequelize";
import { Tag } from "./Tag";
import sequelize from "..";

export class EntityTag extends Model {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly entityId!: number;

  public readonly tagId!: number;
}

EntityTag.init(
  {},
  {
    sequelize,
  }
);

Entity.belongsToMany(Tag, { through: EntityTag });
Tag.belongsToMany(Entity, { through: EntityTag });
