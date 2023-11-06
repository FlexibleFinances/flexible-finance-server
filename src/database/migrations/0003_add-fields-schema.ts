import { DataTypes, type QueryInterface } from "sequelize";
import { fieldTypeTypeEnum } from "../../utils/enumerators";

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
      type: DataTypes.ENUM({ values: Object.keys(fieldTypeTypeEnum) }),
      validate: {
        isIn: [Object.keys(fieldTypeTypeEnum)],
      },
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
    ChildFieldTypeId: {
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

  await queryInterface.createTable("FieldTypeTags", {
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
      references: {
        model: "FieldTypes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    TagId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Tags",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  await queryInterface.createTable("FieldTags", {
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
      references: {
        model: "Fields",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    TagId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Tags",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  await queryInterface.createTable("AccountFields", {
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
    AccountId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Accounts",
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

  await queryInterface.createTable("EntityFields", {
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
    EntityId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Entities",
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

  await queryInterface.createTable("TransactionFields", {
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
    TransactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Transactions",
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
    ChildFieldId: {
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
      references: {
        model: "Accounts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    EntityId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Entities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    TransactionId: {
      type: DataTypes.INTEGER,
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

  console.log("0003 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0003 down - starting");
  await queryInterface.dropTable("FieldTags", {});
  await queryInterface.dropTable("FieldTypeTags", {});
  await queryInterface.dropTable("FieldData", {});
  await queryInterface.dropTable("FieldComponents", {});
  await queryInterface.dropTable("FieldChoices", {});
  await queryInterface.dropTable("TransactionFields");
  await queryInterface.dropTable("EntityFields");
  await queryInterface.dropTable("AccountFields");
  await queryInterface.dropTable("Fields", {});
  await queryInterface.dropTable("FieldTypeComponents", {});
  await queryInterface.dropTable("FieldTypes", {});
  console.log("0003 down - finished");
}
