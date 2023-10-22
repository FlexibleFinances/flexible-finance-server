import type File from "../../database/models/File";

export class FileDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  transactionIds?: number[];

  constructor(file: File) {
    this.id = file.id;
    this.createdAt = file.createdAt.toISOString();
    this.updatedAt = file.updatedAt.toISOString();
    this.name = file.name;
    this.transactionIds = file.TransactionIds;
  }
}
