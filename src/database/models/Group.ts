import {
  type Association,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type CreationOptional,
  DataTypes,
  type HasManyAddAssociationMixin,
  type HasManyAddAssociationsMixin,
  type HasManyCountAssociationsMixin,
  type HasManyCreateAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManyHasAssociationMixin,
  type HasManyHasAssociationsMixin,
  type HasManyRemoveAssociationMixin,
  type HasManyRemoveAssociationsMixin,
  type HasManySetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type Account from "./Account";
import type Entity from "./Entity";
import type Tag from "./Tag";

export class Group extends Model<
  InferAttributes<Group>,
  InferCreationAttributes<Group>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare ParentGroupId?: number;
  declare ParentGroup?: NonAttribute<Group>;

  declare AccountIds: CreationOptional<number[]>;
  declare Accounts: NonAttribute<Account[]>;

  declare ChildGroupIds: CreationOptional<number[]>;
  declare ChildGroups: NonAttribute<Group[]>;

  declare EntityIds: CreationOptional<number[]>;
  declare Entities: NonAttribute<Entity[]>;

  declare TagIds: CreationOptional<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    ParentGroup: Association<Group, Group>;
    ChildGroups: Association<Group, Group>;
    Accounts: Association<Account, Group>;
    Entities: Association<Entity, Group>;
    Tags: Association<Group, Tag>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getParentGroup: BelongsToGetAssociationMixin<Group>;
  declare setParentGroup: BelongsToSetAssociationMixin<Group, number>;

  declare getAccounts: HasManyGetAssociationsMixin<Account>;
  declare addAccount: HasManyAddAssociationMixin<Account, number>;
  declare addAccounts: HasManyAddAssociationsMixin<Account, number>;
  declare setAccounts: HasManySetAssociationsMixin<Account, number>;
  declare removeAccount: HasManyRemoveAssociationMixin<Account, number>;
  declare removeAccounts: HasManyRemoveAssociationsMixin<Account, number>;
  declare hasAccount: HasManyHasAssociationMixin<Account, number>;
  declare hasAccounts: HasManyHasAssociationsMixin<Account, number>;
  declare countAccounts: HasManyCountAssociationsMixin;
  declare createAccounts: HasManyCreateAssociationMixin<
    Account,
    "ParentGroupId"
  >;

  declare getChildGroups: HasManyGetAssociationsMixin<Group>;
  declare addChildGroup: HasManyAddAssociationMixin<Group, number>;
  declare addChildGroups: HasManyAddAssociationsMixin<Group, number>;
  declare setChildGroups: HasManySetAssociationsMixin<Group, number>;
  declare removeChildGroup: HasManyRemoveAssociationMixin<Group, number>;
  declare removeChildGroups: HasManyRemoveAssociationsMixin<Group, number>;
  declare hasChildGroup: HasManyHasAssociationMixin<Group, number>;
  declare hasChildGroups: HasManyHasAssociationsMixin<Group, number>;
  declare countChildGroups: HasManyCountAssociationsMixin;
  declare createChildGroups: HasManyCreateAssociationMixin<
    Group,
    "ParentGroupId"
  >;

  declare getEntities: HasManyGetAssociationsMixin<Entity>;
  declare addEntity: HasManyAddAssociationMixin<Entity, number>;
  declare addEntities: HasManyAddAssociationsMixin<Entity, number>;
  declare setEntities: HasManySetAssociationsMixin<Entity, number>;
  declare removeEntity: HasManyRemoveAssociationMixin<Entity, number>;
  declare removeEntities: HasManyRemoveAssociationsMixin<Entity, number>;
  declare hasEntity: HasManyHasAssociationMixin<Entity, number>;
  declare hasEntities: HasManyHasAssociationsMixin<Entity, number>;
  declare countEntities: HasManyCountAssociationsMixin;
  declare createEntitys: HasManyCreateAssociationMixin<Entity, "ParentGroupId">;

  declare getTags: HasManyGetAssociationsMixin<Tag>;
  declare addTag: HasManyAddAssociationMixin<Tag, number>;
  declare addTags: HasManyAddAssociationsMixin<Tag, number>;
  declare setTags: HasManySetAssociationsMixin<Tag, number>;
  declare removeTag: HasManyRemoveAssociationMixin<Tag, number>;
  declare removeTags: HasManyRemoveAssociationsMixin<Tag, number>;
  declare hasTag: HasManyHasAssociationMixin<Tag, number>;
  declare hasTags: HasManyHasAssociationsMixin<Tag, number>;
  declare countTags: HasManyCountAssociationsMixin;
  declare createTag: HasManyCreateAssociationMixin<Tag, "id">;
}

export function initializeGroup(sequelize: Sequelize): void {
  Group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      ParentGroupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Group",
          key: "id",
        },
      },
      AccountIds: DataTypes.VIRTUAL,
      ChildGroupIds: DataTypes.VIRTUAL,
      EntityIds: DataTypes.VIRTUAL,
      TagIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
    }
  );
}

export default Group;
