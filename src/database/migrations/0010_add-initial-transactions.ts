import Account from "../models/Account";
import Entity from "../models/Entity";
import Field from "../models/Field";
import FieldDatum from "../models/FieldDatum";
import { Op } from "sequelize";
import { type QueryInterface } from "sequelize";
import Transaction from "../models/Transaction";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0010 up - starting");
  // #region Load Fields
  const transactionDate = await Field.findOne({
    where: {
      name: "Transaction Date",
    },
  });
  // #endregion

  // #region Transactors
  const checkingOne = await Account.findOne({
    where: {
      name: "Checking Acct 1",
    },
  });
  const personA = await Entity.findOne({
    where: {
      name: "Person A",
    },
  });
  // #endregion

  // #region Load Templates
  const transactionTemplate = await Transaction.findOne({
    where: {
      name: "Transaction Template",
      isTemplate: true,
    },
  });
  // #endregion

  // #region Create Transactions
  if (
    transactionDate == null ||
    checkingOne == null ||
    personA == null ||
    transactionTemplate == null
  ) {
    throw new Error();
  }

  const transactionOne = await Transaction.create({
    isTemplate: false,
    TemplateId: transactionTemplate.id,
    SourceTransactorId: checkingOne.id,
    RecipientTransactorId: personA.id,
  });
  // #endregion

  // #region Create Accounts Field Data
  if (transactionOne == null) {
    throw new Error();
  }

  await FieldDatum.create({
    TransactionId: transactionOne.id,
    FieldId: transactionDate.id,
    dateValue: new Date(),
  });
  // #endregion

  console.log("0010 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0010 down - starting");
  await FieldDatum.destroy({
    cascade: true,
    where: {
      TransactionId: { [Op.not]: undefined },
    },
  });
  console.log("0010 down - finished");
}
