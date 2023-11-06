import { type Query } from "express-serve-static-core";
import type Transactor from "../../database/models/Transactor";
import type express from "express";
import { type transactorTypeEnum } from "../../utils/enumerators";

export interface TransactorRequest extends express.Request {
  body: TransactorRequestDto;
}

export interface TransactorSearchRequest extends express.Request {
  query: TransactorSearchRequestDto;
}

export interface TransactorResponse extends express.Response {
  transactor: TransactorResponseDto;
}

export interface TransactorsResponse extends express.Response {
  transactors: TransactorResponseDto[];
}

export interface TransactorRequestDto {
  transactorTypeId: transactorTypeEnum;
}

export interface TransactorSearchRequestDto extends Query {
  offset?: string;
  limit?: string;
  ids?: string[];
  createdAt?: string;
  updatedAt?: string;

  transactorTypeIds?: string[];
}

export class TransactorResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  transactorTypeId: transactorTypeEnum;

  constructor(transactor: Transactor) {
    this.id = transactor.id;
    this.createdAt = transactor.createdAt.toISOString();
    this.updatedAt = transactor.updatedAt.toISOString();
    this.transactorTypeId = transactor.TransactorType.id;
  }
}
