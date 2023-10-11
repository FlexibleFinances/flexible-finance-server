import type Report from "../../database/models/Report";

export class ReportResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  tagIds?: number[];

  constructor(report: Report) {
    this.id = report.id;
    this.createdAt = report.createdAt.toISOString();
    this.updatedAt = report.updatedAt.toISOString();
    this.name = report.name;
    this.tagIds = report.TagIds;
  }
}
