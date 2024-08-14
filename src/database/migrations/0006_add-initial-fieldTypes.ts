import FieldType from "../models/FieldType";
import { type QueryInterface } from "sequelize";
import { fieldTypeTypeEnum } from "../../utils/enumerators";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0006 up - starting");
  await FieldType.create({
    name: "Boolean",
    type: fieldTypeTypeEnum.Boolean,
  });
  await FieldType.create({
    name: "Date",
    type: fieldTypeTypeEnum.Date,
  });
  await FieldType.create({
    name: "Number",
    type: fieldTypeTypeEnum.Number,
  });
  await FieldType.create({
    name: "Text",
    type: fieldTypeTypeEnum.Text,
  });
  console.log("0006 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0006 down - starting");
  await FieldType.truncate({ cascade: true });
  console.log("0006 down - finished");
}
