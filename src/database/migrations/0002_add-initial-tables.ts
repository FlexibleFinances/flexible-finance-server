import { DataTypes, QueryInterface } from "sequelize";
import {
  templateTypeEnum,
  transactorTypeEnum,
} from "../../app/utils/enumerators";
import TransactorType from "../models/TransactorType";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0002 up - starting");
  await queryInterface.createTable("AccountGroups", {
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
  await queryInterface.createTable("Statuses", {
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
  await queryInterface.createTable("Templates", {
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
      type: DataTypes.ENUM({ values: Object.keys(templateTypeEnum) }),
      allowNull: false,
      validate: {
        isIn: [Object.keys(templateTypeEnum)],
      },
    },
  });
  await queryInterface.createTable("Types", {
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
    TemplateId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Templates",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    AccountGroupId: {
      type: DataTypes.INTEGER,
      references: {
        model: "AccountGroups",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    TemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Templates",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
      allowNull: false,
      unique: true,
    },
    TemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Templates",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    SourceTransactorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Transactors",
        key: "id",
      },
    },
    DestinationTransactorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Transactors",
        key: "id",
      },
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

  await queryInterface.createTable("TemplateTags", {
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
  await queryInterface.dropTable("ReportTags", {});
  await queryInterface.dropTable("TemplateTags", {});
  await queryInterface.dropTable("TransactionFiles", {});
  await queryInterface.dropTable("TransactionTags", {});
  await queryInterface.dropTable("Accounts", {});
  await queryInterface.dropTable("Entities", {});
  await queryInterface.dropTable("Transactions", {});
  await queryInterface.dropTable("AccountGroups", {});
  await queryInterface.dropTable("Files", {});
  await queryInterface.dropTable("Reports", {});
  await queryInterface.dropTable("Tags", {});
  await queryInterface.dropTable("Templates", {});
  await queryInterface.dropTable("Statuses", {});
  await queryInterface.dropTable("Types", {});
  await queryInterface.dropTable("Transactors", {});
  await queryInterface.dropTable("TransactorTypes", {});
  console.log("0002 down - finished");
}
