import Account from "../models/Account";
import Entity from "../models/Entity";
import Field from "../models/Field";
import { type QueryInterface } from "sequelize";
import Transaction from "../models/Transaction";
import Transactor from "../models/Transactor";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0008 up - starting");
  const accountNumber = await Field.findOne({
    where: {
      name: "Account Number",
    },
  });
  const bankName = await Field.findOne({
    where: {
      name: "Bank Name",
    },
  });
  const birthdate = await Field.findOne({
    where: {
      name: "Birthdate",
    },
  });
  const companyName = await Field.findOne({
    where: {
      name: "Company Name",
    },
  });
  const dateClosed = await Field.findOne({
    where: {
      name: "Date Closed",
    },
  });
  const dateOpened = await Field.findOne({
    where: {
      name: "Date Opened",
    },
  });
  const firstName = await Field.findOne({
    where: {
      name: "First Name",
    },
  });
  const lastName = await Field.findOne({
    where: {
      name: "Last Name",
    },
  });
  const routingNumber = await Field.findOne({
    where: {
      name: "Routing Number",
    },
  });
  const tin = await Field.findOne({
    where: {
      name: "Taxpayer Identification Number",
    },
  });
  const transactionDate = await Field.findOne({
    where: {
      name: "Transaction Date",
    },
  });
  if (
    accountNumber == null ||
    bankName == null ||
    birthdate == null ||
    companyName == null ||
    dateClosed == null ||
    dateOpened == null ||
    firstName == null ||
    lastName == null ||
    routingNumber == null ||
    tin == null ||
    transactionDate == null
  ) {
    throw new Error();
  }

  const bankTemplate = await Account.create({
    name: "Bank Account Template",
    isTemplate: true,
  });
  await bankTemplate.setFields([
    bankName.id,
    accountNumber.id,
    routingNumber.id,
    dateOpened.id,
    dateClosed.id,
  ]);
  const personTemplate = await Entity.create({
    name: "Person Template",
    isTemplate: true,
  });
  await personTemplate.setFields([
    firstName.id,
    lastName.id,
    birthdate.id,
    tin.id,
  ]);
  const companyTemplate = await Entity.create({
    name: "Company Template",
    isTemplate: true,
  });
  await companyTemplate.setFields([companyName.id, tin.id]);
  const transactionTemplate = await Transaction.create({
    name: "Transaction Template",
    isTemplate: true,
  });
  await transactionTemplate.setFields([transactionDate.id]);
  console.log("0008 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0008 down - starting");
  await Account.truncate({ cascade: true });
  await Entity.truncate({ cascade: true });
  await Transactor.truncate({ cascade: true });
  await Transaction.truncate({ cascade: true });
  console.log("0008 down - finished");
}
