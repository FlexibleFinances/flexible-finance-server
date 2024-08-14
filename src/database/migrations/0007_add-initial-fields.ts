import Field from "../models/Field";
import FieldType from "../models/FieldType";
import { type QueryInterface } from "sequelize";
import { fieldTypeTypeEnum } from "../../utils/enumerators";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0007 up - starting");
  const booleanFieldType = await FieldType.findOne({
    where: {
      type: fieldTypeTypeEnum.Boolean,
    },
  });
  const dateieldType = await FieldType.findOne({
    where: {
      type: fieldTypeTypeEnum.Date,
    },
  });
  const numberFieldType = await FieldType.findOne({
    where: {
      type: fieldTypeTypeEnum.Number,
    },
  });
  const textFieldType = await FieldType.findOne({
    where: {
      type: fieldTypeTypeEnum.Text,
    },
  });
  if (
    booleanFieldType == null ||
    dateieldType == null ||
    numberFieldType == null ||
    textFieldType == null
  ) {
    throw new Error();
  }

  await Field.create({
    name: "Account Number",
    FieldTypeId: numberFieldType.id,
  });
  await Field.create({
    name: "Bank Name",
    FieldTypeId: textFieldType.id,
  });
  await Field.create({
    name: "Birthdate",
    FieldTypeId: dateieldType.id,
  });
  await Field.create({
    name: "Company Name",
    FieldTypeId: textFieldType.id,
  });
  await Field.create({
    name: "Date Closed",
    FieldTypeId: dateieldType.id,
  });
  await Field.create({
    name: "Date Opened",
    FieldTypeId: dateieldType.id,
  });
  await Field.create({
    name: "First Name",
    FieldTypeId: textFieldType.id,
  });
  await Field.create({
    name: "Last Name",
    FieldTypeId: textFieldType.id,
  });
  await Field.create({
    name: "Routing Number",
    FieldTypeId: numberFieldType.id,
  });
  await Field.create({
    name: "Taxpayer Identification Number",
    FieldTypeId: numberFieldType.id,
  });
  await Field.create({
    name: "Transaction Date",
    FieldTypeId: dateieldType.id,
  });
  console.log("0007 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0007 down - starting");
  await Field.truncate({ cascade: true });
  console.log("0007 down - finished");
}
