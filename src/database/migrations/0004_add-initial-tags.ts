import { type QueryInterface } from "sequelize";
import Tag from "../models/Tag";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0004 up - starting");
  await Tag.create({
    name: "Example Tag 1",
  });
  console.log("0004 up - finished");
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  console.log("0004 down - starting");
  await Tag.truncate({ cascade: true });
  console.log("0004 down - finished");
}
