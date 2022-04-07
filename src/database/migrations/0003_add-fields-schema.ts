import { DataTypes, QueryInterface } from "sequelize";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0003 up - started");
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
    type: {
      type: DataTypes.STRING,
    },
    validator: {
      type: DataTypes.STRING,
    },
  });

  await queryInterface.createTable("FieldTypeComponents", {
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
    FieldTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "FieldTypes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    ParentFieldTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "FieldTypes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    validator: {
      type: DataTypes.STRING,
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
    isComponentOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  await queryInterface.createTable("FieldChoices", {
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
    choice: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
    },
  });

  await queryInterface.createTable("FieldComponents", {
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
    ParentFieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Fields",
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

  console.log("0003 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0003 down - starting");
  await queryInterface.dropTable("TemplateFields", {});
  await queryInterface.dropTable("FieldData", {});
  await queryInterface.dropTable("FieldComponents", {});
  await queryInterface.dropTable("FieldChoices", {});
  await queryInterface.dropTable("Fields", {});
  await queryInterface.dropTable("FieldTypeComponents", {});
  await queryInterface.dropTable("FieldTypes", {});
  console.log("0003 down - finished");
}
