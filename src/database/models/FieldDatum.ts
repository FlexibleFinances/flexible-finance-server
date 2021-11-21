import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
} from "sequelize";
import Account from "./Account";
import Entity from "./Entity";
import Field from "./Field";
import Transaction from "./Transaction";
import sequelize from "../index";

interface FieldDatumAttributes {
  stringValue?: string;
  intValue?: number;
  dateValue?: Date;
  boolValue?: boolean;
}

class FieldDatum extends Model implements FieldDatumAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public stringValue?: string;
  public intValue?: number;
  public dateValue?: Date;
  public boolValue?: boolean;

  public readonly field!: Field;

  public readonly account?: Account;
  public readonly entity?: Entity;
  public readonly transaction?: Transaction;

  public static override associations: {
    field: Association<Field, FieldDatum>;
    account: Association<Account, FieldDatum>;
    entity: Association<Entity, FieldDatum>;
    transaction: Association<Transaction, FieldDatum>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getField!: BelongsToGetAssociationMixin<Field>;
  public setField!: BelongsToSetAssociationMixin<Field, number>;
  public createField!: BelongsToCreateAssociationMixin<Field>;

  public getAccount!: BelongsToGetAssociationMixin<Account>;
  public setAccount!: BelongsToSetAssociationMixin<Account, number>;
  public createAccount!: BelongsToCreateAssociationMixin<Account>;

  public getEntity!: BelongsToGetAssociationMixin<Entity>;
  public setEntity!: BelongsToSetAssociationMixin<Entity, number>;
  public createEntity!: BelongsToCreateAssociationMixin<Entity>;

  public getTransaction!: BelongsToGetAssociationMixin<Transaction>;
  public setTransaction!: BelongsToSetAssociationMixin<Transaction, number>;
  public createTransaction!: BelongsToCreateAssociationMixin<Transaction>;
}

FieldDatum.init(
  {
    stringValue: {
      type: DataTypes.STRING,
    },
    intValue: {
      type: DataTypes.INTEGER,
    },
    dateValue: {
      type: DataTypes.DATE,
    },
    boolValue: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  }
);

export default FieldDatum;