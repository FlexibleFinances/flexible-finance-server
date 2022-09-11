import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Field from "./Field";
import FieldDatum from "./FieldDatum";
import Group from "./Group";
import Tag from "./Tag";
import Transactor from "./Transactor";
import TransactorType from "./TransactorType";
import { isTemplatedObject } from "../../utils/helperFunctions";
import { transactorTypeEnum } from "../../utils/enumerators";

export class Entity extends Model<
  InferAttributes<Entity>,
  InferCreationAttributes<Entity>
> {
  declare id: CreationOptional<number>;
  declare TransactorTypeId: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare TemplateId: number | null;
  declare Template: NonAttribute<Entity>;

  declare isTemplate: boolean;

  declare FieldIds: CreationOptional<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare FieldDatumIds: CreationOptional<number[]>;
  declare FieldData: NonAttribute<FieldDatum[]>;

  declare GroupId: CreationOptional<number>;
  declare Group: NonAttribute<Group>;

  declare TagIds: NonAttribute<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare static associations: {
    Fields: Association<Entity, Field>;
    FieldData: Association<Entity, FieldDatum>;
    Group: Association<Entity, Group>;
    Tags: Association<Entity, Tag>;
    Template: Association<Entity, Entity>;
    Transactor: Association<Entity, Transactor>;
    TransactorType: Association<Entity, TransactorType>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getGroup: BelongsToGetAssociationMixin<Group>;
  declare setGroup: BelongsToSetAssociationMixin<Group, number>;

  declare getTemplate: BelongsToGetAssociationMixin<Entity>;
  declare setTemplate: BelongsToSetAssociationMixin<Entity, number>;

  declare getTransactorType: BelongsToGetAssociationMixin<TransactorType>;

  declare createTransactor: BelongsToCreateAssociationMixin<Transactor>;
  declare getTransactor: BelongsToGetAssociationMixin<Transactor>;
  declare setTransactor: BelongsToSetAssociationMixin<Transactor, number>;

  declare getFieldData: HasManyGetAssociationsMixin<FieldDatum>;
  declare addFieldDatum: HasManyAddAssociationMixin<FieldDatum, number>;
  declare addFieldData: HasManyAddAssociationsMixin<FieldDatum, number>;
  declare setFieldData: HasManySetAssociationsMixin<FieldDatum, number>;
  declare removeFieldDatum: HasManyRemoveAssociationMixin<FieldDatum, number>;
  declare removeFieldData: HasManyRemoveAssociationsMixin<FieldDatum, number>;
  declare hasFieldDatum: HasManyHasAssociationMixin<FieldDatum, number>;
  declare hasFieldData: HasManyHasAssociationsMixin<FieldDatum, number>;
  declare countFieldData: HasManyCountAssociationsMixin;
  declare createFieldDatum: HasManyCreateAssociationMixin<
    FieldDatum,
    "EntityId"
  >;

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

  public async setFieldDatumAndFieldIds(): Promise<Entity> {
    this.setDataValue("FieldDatumIds", []);
    this.setDataValue("FieldIds", []);
    const entityData = await this.getFieldData();
    entityData.forEach((datum) => {
      const fieldDatumIds = this.getDataValue("FieldDatumIds");
      fieldDatumIds.push(datum.id);
      this.setDataValue("FieldDatumIds", fieldDatumIds);
      const fieldIds = this.getDataValue("FieldIds");
      fieldIds.push(datum.FieldId);
      this.setDataValue("FieldIds", fieldIds);
    });
    return this;
  }
}

export function initializeEntity(sequelize: Sequelize): void {
  Entity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        references: {
          model: "Transactors",
          key: "id",
        },
      },
      TransactorTypeId: {
        type: "SMALLINT GENERATED ALWAYS AS (2) STORED",
        set() {
          throw new Error("generatedValue is read-only");
        },
        references: {
          model: "TransactorTypes",
          key: "id",
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      TemplateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Entity",
          key: "id",
        },
      },
      isTemplate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      GroupId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Group",
          key: "id",
        },
      },
      FieldIds: DataTypes.VIRTUAL,
      FieldDatumIds: DataTypes.VIRTUAL,
    },
    {
      hooks: {
        beforeCreate: async (entity, options) => {
          const newTransactor = await Transactor.create({
            TransactorTypeId: transactorTypeEnum.Entity,
          });
          entity.id = newTransactor.id;
        },
      },
      sequelize,
      validate: {
        validateModel() {
          isTemplatedObject(
            [this.TemplateId as number],
            this.isTemplate as boolean
          );
        },
      },
    }
  );
}

export default Entity;
