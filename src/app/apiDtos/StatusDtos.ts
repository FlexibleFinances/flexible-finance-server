import type Status from "../../database/models/Status";

export class StatusResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;

  constructor(status: Status) {
    this.id = status.id;
    this.createdAt = status.createdAt.toISOString();
    this.updatedAt = status.updatedAt.toISOString();
    this.name = status.name;
  }
}
