import type Account from "../../database/models/Account";
import type Entity from "../../database/models/Entity";
import type Transactor from "../../database/models/Transactor";

export class TransactorResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  transactorTypeId: number;
  accounts?: Account[];
  entities?: Entity[];

  constructor(transactor: Transactor) {
    this.id = transactor.id;
    this.createdAt = transactor.createdAt.toISOString();
    this.updatedAt = transactor.updatedAt.toISOString();
    this.transactorTypeId = transactor.TransactorTypeId;
    this.accounts = [transactor.Account];
    this.entities = [transactor.Entity];
  }
}
