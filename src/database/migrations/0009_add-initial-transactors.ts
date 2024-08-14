import Account from "../models/Account";
import Entity from "../models/Entity";
import Field from "../models/Field";
import FieldDatum from "../models/FieldDatum";
import Group from "../models/Group";
import { type QueryInterface } from "sequelize";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0009 up - starting");
  // #region Load Groups
  const bankOne = await Group.findOne({ where: { name: "Example Bank 1" } });
  const bankTwo = await Group.findOne({ where: { name: "Example Bank 2" } });
  // #endregion

  // #region Load Fields
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
  // #endregion

  // #region Load Templates
  const bankTemplate = await Account.findOne({
    where: {
      name: "Bank Account Template",
      isTemplate: true,
    },
  });
  const personTemplate = await Entity.findOne({
    where: {
      name: "Person Template",
      isTemplate: true,
    },
  });
  const companyTemplate = await Entity.findOne({
    where: {
      name: "Company Template",
      isTemplate: true,
    },
  });
  // #endregion

  // #region Create Transactors
  if (
    bankOne == null ||
    bankTwo == null ||
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
    bankTemplate == null ||
    personTemplate == null ||
    companyTemplate == null
  ) {
    throw new Error();
  }

  const checkingOne = await Account.create({
    name: "Checking Acct 1",
    isTemplate: false,
    TemplateId: bankTemplate.id,
    ParentGroupId: bankOne.id,
  });
  const savingsOne = await Account.create({
    name: "Savings Acct 1",
    isTemplate: false,
    TemplateId: bankTemplate.id,
    ParentGroupId: bankOne.id,
  });
  const checkingTwo = await Account.create({
    name: "Checking Acct 2",
    isTemplate: false,
    TemplateId: bankTemplate.id,
    ParentGroupId: bankTwo.id,
  });
  const personA = await Entity.create({
    name: "Person A",
    isTemplate: false,
    TemplateId: personTemplate.id,
  });
  const personB = await Entity.create({
    name: "Person B",
    isTemplate: false,
    TemplateId: personTemplate.id,
  });
  const companyOrange = await Entity.create({
    name: "Company Orange",
    isTemplate: false,
    TemplateId: companyTemplate.id,
  });
  const companyPurple = await Entity.create({
    name: "Company Purple",
    isTemplate: false,
    TemplateId: companyTemplate.id,
  });
  // #endregion

  // #region Create Accounts Field Data
  if (checkingOne == null || savingsOne == null || checkingTwo == null) {
    throw new Error();
  }

  await FieldDatum.create({
    AccountId: checkingOne.id,
    FieldId: accountNumber.id,
    intValue: 12345,
  });
  await FieldDatum.create({
    AccountId: checkingOne.id,
    FieldId: bankName.id,
    stringValue: "Example Bank 1",
  });
  await FieldDatum.create({
    AccountId: checkingOne.id,
    FieldId: dateOpened.id,
    dateValue: new Date(),
  });
  await FieldDatum.create({
    AccountId: checkingOne.id,
    FieldId: routingNumber.id,
    intValue: 98765,
  });

  await FieldDatum.create({
    AccountId: savingsOne.id,
    FieldId: accountNumber.id,
    intValue: 34567,
  });
  await FieldDatum.create({
    AccountId: savingsOne.id,
    FieldId: bankName.id,
    stringValue: "Example Bank 1",
  });
  await FieldDatum.create({
    AccountId: savingsOne.id,
    FieldId: dateOpened.id,
    dateValue: new Date(),
  });
  await FieldDatum.create({
    AccountId: savingsOne.id,
    FieldId: routingNumber.id,
    intValue: 98765,
  });

  await FieldDatum.create({
    AccountId: checkingTwo.id,
    FieldId: accountNumber.id,
    intValue: 24531,
  });
  await FieldDatum.create({
    AccountId: checkingTwo.id,
    FieldId: bankName.id,
    stringValue: "Example Bank 1",
  });
  await FieldDatum.create({
    AccountId: checkingTwo.id,
    FieldId: dateOpened.id,
    dateValue: new Date(),
  });
  await FieldDatum.create({
    AccountId: checkingTwo.id,
    FieldId: routingNumber.id,
    intValue: 76543,
  });
  // #endregion

  // #region Create Persons Field Data
  if (personA == null || personB == null) {
    throw new Error();
  }

  await FieldDatum.create({
    EntityId: personA.id,
    FieldId: firstName.id,
    stringValue: "aaa",
  });
  await FieldDatum.create({
    EntityId: personA.id,
    FieldId: lastName.id,
    stringValue: "AAA",
  });
  await FieldDatum.create({
    EntityId: personA.id,
    FieldId: birthdate.id,
    dateValue: new Date(),
  });
  await FieldDatum.create({
    EntityId: personA.id,
    FieldId: tin.id,
    intValue: 13579,
  });

  await FieldDatum.create({
    EntityId: personB.id,
    FieldId: firstName.id,
    stringValue: "bbb",
  });
  await FieldDatum.create({
    EntityId: personB.id,
    FieldId: lastName.id,
    stringValue: "BBB",
  });
  await FieldDatum.create({
    EntityId: personB.id,
    FieldId: birthdate.id,
    dateValue: new Date(),
  });
  await FieldDatum.create({
    EntityId: personB.id,
    FieldId: tin.id,
    intValue: 24680,
  });
  // #endregion

  // #region Create Companies Field Data
  if (companyOrange == null || companyPurple == null) {
    throw new Error();
  }

  await FieldDatum.create({
    EntityId: companyOrange.id,
    FieldId: companyName.id,
    stringValue: "Company Orange",
  });
  await FieldDatum.create({
    EntityId: companyOrange.id,
    FieldId: tin.id,
    intValue: 11111,
  });
  await FieldDatum.create({
    EntityId: companyPurple.id,
    FieldId: companyName.id,
    stringValue: "Company Purple",
  });
  await FieldDatum.create({
    EntityId: companyPurple.id,
    FieldId: tin.id,
    intValue: 22222,
  });
  // #endregion

  console.log("0009 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0009 down - starting");
  await FieldDatum.truncate({ cascade: true });
  console.log("0009 down - finished");
}
