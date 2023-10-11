import type Tag from "../../database/models/Tag";

export class TagResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  accountIds?: number[];
  entityIds?: number[];
  transactionIds?: number[];

  constructor(tag: Tag) {
    this.id = tag.id;
    this.createdAt = tag.createdAt.toISOString();
    this.updatedAt = tag.updatedAt.toISOString();
    this.name = tag.name;
    this.accountIds = tag.AccountIds;
    this.entityIds = tag.EntityIds;
    this.transactionIds = tag.TransactionIds;
  }
}
