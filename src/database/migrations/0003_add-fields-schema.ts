import { DataTypes } from "sequelize";
import sequelize from "../index";
import { templateTypeEnum } from "../../app/utils/enumerators";

const queryInterface = sequelize.getQueryInterface();

export async function up(): Promise<void> {
  await queryInterface.createTable("FieldTypes", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
  });

  await queryInterface.createTable("Fields", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    FieldTypeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "FieldTypes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  await queryInterface.createTable("FieldData", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    FieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Fields",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    AccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Accounts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    EntityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Entities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    TransactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Transactions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
  });
  await queryInterface.createTable("TemplateFields", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TemplateId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Templates",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    FieldId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Fields",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  await queryInterface.addColumn("Templates", "type", {
    type: DataTypes.ENUM({ values: Object.keys(templateTypeEnum) }),
    allowNull: false,
    validate: {
      isIn: [Object.keys(templateTypeEnum)],
    },
  });
  console.log("0003 up");
}

export async function down(): Promise<void> {
  await queryInterface.removeColumn("Templates", "type", {});
  await queryInterface.dropTable("TemplateFields", {});
  await queryInterface.dropTable("FieldData", {});
  await queryInterface.dropTable("Fields", {});
  await queryInterface.dropTable("FieldTypes", {});
  console.log("0003 down");
}
