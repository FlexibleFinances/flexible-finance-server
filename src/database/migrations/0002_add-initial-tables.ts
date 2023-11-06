import { DataTypes, type QueryInterface } from "sequelize";
import TransactorType from "../models/TransactorType";
import { transactorTypeEnum } from "../../utils/enumerators";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0002 up - starting");
  await queryInterface.createTable("Groups", {
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
    ParentGroupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Groups",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });
  await queryInterface.createTable("Files", {
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
  await queryInterface.createTable("Reports", {
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
  await queryInterface.createTable("Tags", {
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

  await queryInterface.createTable("TransactorTypes", {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: false,
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
      type: DataTypes.STRING,
    },
  });
  await TransactorType.findOrCreate({
    where: {
      id: transactorTypeEnum.Account,
      name: "Account",
    },
  });
  await TransactorType.findOrCreate({
    where: {
      id: transactorTypeEnum.Entity,
      name: "Entity",
    },
  });
  await queryInterface.createTable("Transactors", {
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
    TransactorTypeId: {
      type: DataTypes.SMALLINT,
      references: {
        model: "TransactorTypes",
        key: "id",
      },
    },
  });
  await queryInterface.createTable("Accounts", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: "Transactors",
        key: "id",
      },
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
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    ParentGroupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Groups",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    TemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Accounts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
  });
  await queryInterface.createTable("Entities", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: "Transactors",
        key: "id",
      },
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
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    ParentGroupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Groups",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    TemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Entities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    TransactorTypeId: {
      type: "SMALLINT GENERATED ALWAYS AS (2) STORED",
      set() {
        throw new Error("generatedValue is read-only");
      },
      references: {
        model: "TransactorTypes",
        key: "id",
      },
    },
  });
  await queryInterface.createTable("Transactions", {
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
      allowNull: true,
      unique: true,
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    RecipientTransactorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Transactors",
        key: "id",
      },
    },
    SourceTransactorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Transactors",
        key: "id",
      },
    },
    TemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Transactions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  await queryInterface.createTable("AccountTags", {
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

  await queryInterface.createTable("EntityTags", {
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

  await queryInterface.createTable("GroupTags", {
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
    GroupId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Groups",
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

  await queryInterface.createTable("ReportTags", {
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
    ReportId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Reports",
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

  await queryInterface.createTable("TransactionFiles", {
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
    FileId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Files",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  await queryInterface.createTable("TransactionTags", {
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

  console.log("0002 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0002 down - starting");
  await queryInterface.dropTable("AccountTags", {});
  await queryInterface.dropTable("EntityTags", {});
  await queryInterface.dropTable("GroupTags", {});
  await queryInterface.dropTable("ReportTags", {});
  await queryInterface.dropTable("TransactionFiles", {});
  await queryInterface.dropTable("TransactionTags", {});
  await queryInterface.dropTable("Accounts", {});
  await queryInterface.dropTable("Entities", {});
  await queryInterface.dropTable("Transactions", {});
  await queryInterface.dropTable("Groups", {});
  await queryInterface.dropTable("Files", {});
  await queryInterface.dropTable("Reports", {});
  await queryInterface.dropTable("Tags", {});
  await queryInterface.dropTable("Transactors", {});
  await queryInterface.dropTable("TransactorTypes", {});
  console.log("0002 down - finished");
}
