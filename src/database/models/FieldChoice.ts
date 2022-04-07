import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import Field from "./Field";

export class FieldChoice extends Model<
  InferAttributes<FieldChoice>,
  InferCreationAttributes<FieldChoice>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare FieldId: number;
  declare Field: NonAttribute<Field>;
  declare choice: string;
  declare order?: CreationOptional<number>;

  declare static associations: {
    Field: Association<FieldChoice, Field>;
  };

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getField: BelongsToGetAssociationMixin<Field>;
  declare setField: BelongsToSetAssociationMixin<Field, number>;
}

export function initializeFieldChoice(sequelize: Sequelize): void {
  FieldChoice.init(
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
          model: "Field",
          key: "id",
        },
      },
      choice: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      order: DataTypes.INTEGER,
    },
    {
      sequelize,
    }
  );
}

export default FieldChoice;
