import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Status extends Model<
  InferAttributes<Status>,
  InferCreationAttributes<Status>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;
}

export function initializeStatus(sequelize: Sequelize): void {
  Status.init(
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

export default Status;
