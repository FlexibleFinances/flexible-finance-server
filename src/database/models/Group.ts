import {
  Association,
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
import Account from "./Account";

export class Group extends Model<
  InferAttributes<Group>,
  InferCreationAttributes<Group>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare AccountIds: NonAttribute<number[]>;
  declare Accounts: NonAttribute<Account[]>;

  declare static associations: {
    Accounts: Association<Account, Group>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getAccounts: HasManyGetAssociationsMixin<Account>;
  declare addAccount: HasManyAddAssociationMixin<Account, number>;
  declare addAccounts: HasManyAddAssociationsMixin<Account, number>;
  declare setAccounts: HasManySetAssociationsMixin<Account, number>;
  declare removeAccount: HasManyRemoveAssociationMixin<Account, number>;
  declare removeAccounts: HasManyRemoveAssociationsMixin<Account, number>;
  declare hasAccount: HasManyHasAssociationMixin<Account, number>;
  declare hasAccounts: HasManyHasAssociationsMixin<Account, number>;
  declare countAccounts: HasManyCountAssociationsMixin;
  declare createAccounts: HasManyCreateAssociationMixin<Account, "GroupId">;
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
    },
    {
      sequelize,
    }
  );
}

export default Group;
