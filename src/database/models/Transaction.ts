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
import {
  getFieldDatumIds,
  getFieldIds,
  getTagIds,
  isTemplatedObject,
} from "../../utils/helperFunctions";
import Account from "./Account";
import Entity from "./Entity";
import Field from "./Field";
import FieldDatum from "./FieldDatum";
import Tag from "./Tag";
import Transactor from "./Transactor";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: CreationOptional<string>;

  declare isTemplate: boolean;

  declare FieldIds: CreationOptional<number[]>;
  declare Fields: NonAttribute<Field[]>;

  declare FieldDatumIds: CreationOptional<number[]>;
  declare FieldData: NonAttribute<FieldDatum[]>;

  declare RecipientTransactorId: number | null;
  declare RecipientTransactor: NonAttribute<Account | Entity>;

  declare SourceTransactorId: number | null;
  declare SourceTransactor: NonAttribute<Account | Entity>;

  declare TagIds: CreationOptional<number[]>;
  declare Tags: NonAttribute<Tag[]>;

  declare TemplateId: number | null;
  declare Template: NonAttribute<Transaction>;

  declare static associations: {
    Fields: Association<Transaction, Field>;
    FieldData: Association<Transaction, FieldDatum>;
    RecipientTransactor: Association<Transaction, Transactor>;
    SourceTransactor: Association<Transaction, Transactor>;
    Tags: Association<Transaction, Tag>;
    Template: Association<Transaction, Transaction>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare createSourceTransactor: BelongsToCreateAssociationMixin<Transactor>;
  declare getSourceTransactor: BelongsToGetAssociationMixin<Transactor>;
  declare setSourceTransactor: BelongsToSetAssociationMixin<Transactor, number>;

  declare createRecipientTransactor: BelongsToCreateAssociationMixin<Transactor>;
  declare getRecipientTransactor: BelongsToGetAssociationMixin<Transactor>;
  declare setRecipientTransactor: BelongsToSetAssociationMixin<
    Transactor,
    number
  >;

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

  declare addFieldDatum: HasManyAddAssociationMixin<FieldDatum, number>;
  declare addFieldData: HasManyAddAssociationsMixin<FieldDatum, number>;
  declare countFieldData: HasManyCountAssociationsMixin;
  declare getFieldData: HasManyGetAssociationsMixin<FieldDatum>;
  declare hasFieldDatum: HasManyHasAssociationMixin<FieldDatum, number>;
  declare hasFieldData: HasManyHasAssociationsMixin<FieldDatum, number>;
  declare removeFieldDatum: HasManyRemoveAssociationMixin<FieldDatum, number>;
  declare removeFieldData: HasManyRemoveAssociationsMixin<FieldDatum, number>;
  declare setFieldData: HasManySetAssociationsMixin<FieldDatum, number>;
  declare createFieldDatum: HasManyCreateAssociationMixin<
    FieldDatum,
    "TransactionId"
  >;

  declare addTag: HasManyAddAssociationMixin<Tag, number>;
  declare addTags: HasManyAddAssociationsMixin<Tag, number>;
  declare countTags: HasManyCountAssociationsMixin;
  declare createTag: HasManyCreateAssociationMixin<Tag, "id">;
  declare getTags: HasManyGetAssociationsMixin<Tag>;
  declare hasTag: HasManyHasAssociationMixin<Tag, number>;
  declare hasTags: HasManyHasAssociationsMixin<Tag, number>;
  declare removeTag: HasManyRemoveAssociationMixin<Tag, number>;
  declare removeTags: HasManyRemoveAssociationsMixin<Tag, number>;
  declare setTags: HasManySetAssociationsMixin<Tag, number>;

  declare getTemplate: BelongsToGetAssociationMixin<Transaction>;
  declare setTemplate: BelongsToSetAssociationMixin<Transaction, number>;

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

export function initializeTransaction(sequelize: Sequelize): void {
  Transaction.init(
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
        allowNull: true,
        unique: true,
      },
      isTemplate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      RecipientTransactorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Transactors",
          key: "id",
        },
      },
      SourceTransactorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Transactors",
          key: "id",
        },
      },
      TemplateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Transaction",
          key: "id",
        },
      },
      FieldIds: DataTypes.VIRTUAL,
      FieldDatumIds: DataTypes.VIRTUAL,
      TagIds: DataTypes.VIRTUAL,
    },
    {
      sequelize,
      validate: {
        validateModel() {
          isTemplatedObject(
            [
              this.TemplateId as number,
              this.SourceTransactorId as number,
              this.RecipientTransactorId as number,
            ],
            this.isTemplate as boolean
          );
        },
      },
    }
  );
}

export default Transaction;
