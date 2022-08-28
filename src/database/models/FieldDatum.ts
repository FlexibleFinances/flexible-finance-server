import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationAttributes,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Account from "./Account";
import Entity from "./Entity";
import Field from "./Field";
import Transaction from "./Transaction";

export class FieldDatum extends Model<
  InferAttributes<FieldDatum>,
  InferCreationAttributes<FieldDatum>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare stringValue: CreationOptional<string>;
  declare intValue: CreationOptional<number>;
  declare dateValue: CreationOptional<Date>;
  declare boolValue: CreationOptional<boolean>;

  declare FieldId: number;
  declare Field: NonAttribute<Field>;

  declare AccountId: CreationOptional<number>;
  declare Account: NonAttribute<Account>;
  declare EntityId: CreationOptional<number>;
  declare Entity: NonAttribute<Entity>;
  declare TransactionId: CreationOptional<number>;
  declare Transaction: NonAttribute<Transaction>;

  declare static associations: {
    Field: Association<Field, FieldDatum>;
    Account: Association<Account, FieldDatum>;
    Entity: Association<Entity, FieldDatum>;
    Transaction: Association<Transaction, FieldDatum>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getField: BelongsToGetAssociationMixin<Field>;
  declare setField: BelongsToSetAssociationMixin<Field, number>;

  declare getAccount: BelongsToGetAssociationMixin<Account>;
  declare setAccount: BelongsToSetAssociationMixin<Account, number>;

  declare getEntity: BelongsToGetAssociationMixin<Entity>;
  declare setEntity: BelongsToSetAssociationMixin<Entity, number>;

  declare getTransaction: BelongsToGetAssociationMixin<Transaction>;
  declare setTransaction: BelongsToSetAssociationMixin<Transaction, number>;

  public static async upsertFieldData(
    fieldValues: FieldValues,
    accountId?: number,
    entityId?: number,
    transactionId?: number
  ): Promise<FieldDatum[]> {
    if (
      accountId === undefined &&
      entityId === undefined &&
      transactionId === undefined
    ) {
      throw new Error(
        "Could not upsert field data. No account, entity, or transaction ID provided."
      );
    }
    const upsertFieldDataPromises: Array<Promise<FieldDatum>> = [];
    if (fieldValues !== undefined) {
      Object.entries(fieldValues).forEach(
        ([fieldId, fieldValueInfo]: [
          string,
          { value: string | number | Date | boolean; fieldDatumId: number }
        ]) => {
          const upsertFieldDataOptions: CreationAttributes<FieldDatum> = {
            FieldId: +fieldId,
          };
          const fieldDatumId = fieldValueInfo.fieldDatumId;
          if (
            fieldDatumId !== undefined &&
            fieldDatumId !== null &&
            !isNaN(+fieldDatumId)
          ) {
            upsertFieldDataOptions.id = +fieldDatumId;
          }
          if (accountId !== undefined) {
            upsertFieldDataOptions.AccountId = accountId;
          } else if (entityId !== undefined) {
            upsertFieldDataOptions.EntityId = entityId;
          } else if (transactionId !== undefined) {
            upsertFieldDataOptions.TransactionId = transactionId;
          }
          const fieldDatumValue = fieldValueInfo.value;
          if (typeof fieldDatumValue === "string") {
            upsertFieldDataOptions.stringValue = fieldDatumValue;
          } else if (typeof fieldDatumValue === "number") {
            upsertFieldDataOptions.intValue = fieldDatumValue;
          } else if (fieldDatumValue instanceof Date) {
            upsertFieldDataOptions.dateValue = fieldDatumValue;
          } else if (typeof fieldDatumValue === "boolean") {
            upsertFieldDataOptions.boolValue = fieldDatumValue;
          }
          upsertFieldDataPromises.push(
            FieldDatum.upsert(upsertFieldDataOptions).then(
              (result) => result[0]
            )
          );
        }
      );
    }
    return await Promise.all(upsertFieldDataPromises);
  }
}

export function initializeFieldDatum(sequelize: Sequelize): void {
  FieldDatum.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      FieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Fields",
          key: "id",
        },
      },
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
      AccountId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Accounts",
          key: "id",
        },
      },
      EntityId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Entities",
          key: "id",
        },
      },
      TransactionId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Transactions",
          key: "id",
        },
      },
    },
    {
      sequelize,
      name: {
        singular: "FieldDatum",
        plural: "FieldData",
      },
      validate: {
        onlyOneObject() {
          const objectList = [
            this.AccountId,
            this.EntityId,
            this.TransactionId,
          ];
          const nonNullCount = objectList.reduce((prevValue, currValue) => {
            if (currValue === null || currValue === undefined) {
              prevValue = (prevValue as number) - 1;
            }
            return prevValue;
          }, objectList.length);
          if (nonNullCount !== 1) {
            throw new Error(
              "A FieldDatum record must be associated with exactly one of the following: Account, Entity, or Transaction."
            );
          }
        },
      },
    }
  );
}

export interface FieldValues {
  [fieldId: number]: {
    value: string | boolean | Date | number;
    fieldDatumId: number;
  };
}

export default FieldDatum;
