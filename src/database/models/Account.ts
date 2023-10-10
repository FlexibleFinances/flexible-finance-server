import {
  type Association,
  type BelongsToCreateAssociationMixin,
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
import {
  getFieldDatumIds,
  getFieldIds,
  getTagIds,
  isTemplatedObject,
} from "../../utils/helperFunctions";
import type Field from "./Field";
import type FieldDatum from "./FieldDatum";
import type Group from "./Group";
import type Tag from "./Tag";
import Transactor from "./Transactor";
import type TransactorType from "./TransactorType";
import { transactorTypeEnum } from "../../utils/enumerators";

export class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare isTemplate: boolean;

  declare FieldIds: CreationOptional<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare FieldDatumIds: CreationOptional<number[]>;
  declare FieldData: NonAttribute<FieldDatum[]>;

  declare GroupId: CreationOptional<number>;
  declare Group: NonAttribute<Group>;

  declare TagIds: CreationOptional<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare TemplateId: number | null;
  declare Template: NonAttribute<Account>;

  declare TransactorTypeId: CreationOptional<number>;

  declare static associations: {
    Fields: Association<Account, Field>;
    FieldData: Association<Account, FieldDatum>;
    Group: Association<Account, Group>;
    Tags: Association<Account, Tag>;
    Template: Association<Account, Account>;
    Transactor: Association<Account, Transactor>;
    TransactorType: Association<Account, TransactorType>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getFields: HasManyGetAssociationsMixin<Field>;
  declare addField: HasManyAddAssociationMixin<Field, number>;
  declare addFields: HasManyAddAssociationsMixin<Field, number>;
  declare setFields: HasManySetAssociationsMixin<Field, number>;
  declare removeField: HasManyRemoveAssociationMixin<Field, number>;
  declare removeFields: HasManyRemoveAssociationsMixin<Field, number>;
  declare hasField: HasManyHasAssociationMixin<Field, number>;
  declare hasFields: HasManyHasAssociationsMixin<Field, number>;
  declare countFields: HasManyCountAssociationsMixin;
  declare createField: HasManyCreateAssociationMixin<Field, "id">;

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
    "AccountId"
  >;

  declare getGroup: BelongsToGetAssociationMixin<Group>;
  declare setGroup: BelongsToSetAssociationMixin<Group, number>;

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

  declare getTemplate: BelongsToGetAssociationMixin<Account>;
  declare setTemplate: BelongsToSetAssociationMixin<Account, number>;

  declare createTransactor: BelongsToCreateAssociationMixin<Transactor>;
  declare getTransactor: BelongsToGetAssociationMixin<Transactor>;
  declare setTransactor: BelongsToSetAssociationMixin<Transactor, number>;

  declare getTransactorType: BelongsToGetAssociationMixin<TransactorType>;

  public async loadFieldIds(): Promise<void> {
    const fieldIds = await getFieldIds(this);
    this.setDataValue("FieldIds", fieldIds);
  }

  public async loadFieldDatumIds(): Promise<void> {
    const fieldDatumIds = await getFieldDatumIds(this);
    this.setDataValue("FieldDatumIds", fieldDatumIds);
  }

  public async loadTagIds(): Promise<void> {
    const tagIds = await getTagIds(this);
    this.setDataValue("TagIds", tagIds);
  }

  public async loadAssociatedIds(): Promise<void> {
    const loadPromises = [this.loadTagIds()];
    if (this.isTemplate) {
      loadPromises.push(this.loadFieldIds());
    } else {
      loadPromises.push(this.loadFieldDatumIds());
    }
    await Promise.all(loadPromises);
  }
}

export function initializeAccount(sequelize: Sequelize): void {
  Account.init(
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
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
      TemplateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Account",
          key: "id",
        },
      },
      TransactorTypeId: {
        type: "SMALLINT GENERATED ALWAYS AS (1) STORED",
        set() {
          throw new Error("generatedValue is read-only");
        },
        references: {
          model: "TransactorTypes",
          key: "id",
        },
      },
      FieldIds: DataTypes.VIRTUAL,
      FieldDatumIds: DataTypes.VIRTUAL,
      TagIds: DataTypes.VIRTUAL,
    },
    {
      hooks: {
        beforeCreate: async (account, options) => {
          const newTransactor = await Transactor.create({
            TransactorTypeId: transactorTypeEnum.Account,
          });
          account.id = newTransactor.id;
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

export default Account;
