import type Type from "../../database/models/Type";

export class TypeResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;

  constructor(type: Type) {
    this.id = type.id;
    this.createdAt = type.createdAt.toISOString();
    this.updatedAt = type.updatedAt.toISOString();
    this.name = type.name;
  }
}
