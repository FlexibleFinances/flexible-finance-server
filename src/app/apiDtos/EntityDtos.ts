import type Entity from "../../database/models/Entity";

export class EntityResponseDto {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  parentGroupId?: number;
  fieldDatumIds?: number[];
  fieldIds?: number[];
  tagIds?: number[];
  templateId: number | null;
  isTemplate: boolean;

  constructor(entity: Entity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt.toISOString();
    this.updatedAt = entity.updatedAt.toISOString();
    this.name = entity.name;
    this.parentGroupId = entity.GroupId;
    this.fieldDatumIds = entity.FieldDatumIds;
    this.fieldIds = entity.FieldIds;
    this.tagIds = entity.TagIds;
    this.templateId = entity.TemplateId;
    this.isTemplate = entity.isTemplate;
  }
}
