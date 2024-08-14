import Group from "../models/Group";
import { type QueryInterface } from "sequelize";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0005 up - starting");
  await Group.create({
    name: "Example Bank 1",
  });
  await Group.create({
    name: "Example Bank 2",
  });
  console.log("0005 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0005 down - starting");
  await Group.truncate({ cascade: true });
  console.log("0005 down - finished");
}
