import Account from "../database/models/Account";
import Entity from "../database/models/Entity";
import Field from "../database/models/Field";
import FieldDatum from "../database/models/FieldDatum";
import Tag from "../database/models/Tag";
import Transaction from "../database/models/Transaction";
import express from "express";

interface paramObject {
  body?: string[];
  query?: string[];
  params?: string[];
}

export function hasRequestParameters(
  req: express.Request,
  res: express.Response,
  requiredParameters: paramObject,
  minOneParameters?: paramObject
): boolean {
  let message = "";
  requiredParameters.body?.forEach((paramName: string) => {
    if (req.body[paramName] === undefined) {
      message = `Missing ${paramName} in request body.`;
    }
  });
  requiredParameters.query?.forEach((paramName: string) => {
    if (req.query[paramName] === undefined) {
      message = `Missing ${paramName} in request query.`;
    }
  });
  requiredParameters.params?.forEach((paramName: string) => {
    if (req.params[paramName] === undefined) {
      message = `Missing ${paramName} in request params.`;
    }
  });
  if (
    minOneParameters?.body?.some((paramName: string) => {
      return req.body[paramName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneParameters.body.join(
      ", "
    )}] in request body.`;
  }
  if (
    minOneParameters?.query?.some((paramName: string) => {
      return req.query[paramName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneParameters.query.join(
      ", "
    )}] in request query.`;
  }
  if (
    minOneParameters?.params?.some((paramName: string) => {
      return req.params[paramName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneParameters.params.join(
      ", "
    )}] in request params.`;
  }
  if (message !== "") {
    res.status(400).send({ message });
    return false;
  }
  return true;
}

export function isTemplatedObject(
  requiredProperties: Array<number | null>,
  isTemplate: boolean
): boolean {
  if (requiredProperties.includes(null) && !isTemplate) {
    throw new Error(
      "A templated object must be a template or have all the required fields."
    );
  }
  return true;
}

export async function getFieldIds(
  object: Account | Entity | Transaction
): Promise<number[]> {
  const fields = await object.getFields();
  return fields.map((field: Field) => field.id);
}

export async function getFieldDatumIds(
  object: Account | Entity | Transaction
): Promise<number[]> {
  const fieldData = await object.getFieldData();
  return fieldData.map((fieldDatum: FieldDatum) => fieldDatum.id);
}

export async function getTagIds(
  object: Account | Entity | Transaction
): Promise<number[]> {
  const tags = await object.getTags();
  return tags.map((tag: Tag) => tag.id);
}

export function minimizeAssociationsToIds<
  T extends Account | Entity | Transaction
>(object: T): T {
  let miniObject;
  if (object instanceof Account) {
    miniObject = new Account();
    miniObject.GroupId = object.GroupId;
  } else if (object instanceof Entity) {
    miniObject = new Entity();
    miniObject.GroupId = object.GroupId;
  } else if (object instanceof Transaction) {
    miniObject = new Transaction();
    miniObject.SourceTransactorId = object.SourceTransactorId;
    miniObject.RecipientTransactorId = object.RecipientTransactorId;
  } else {
    throw new Error("unknown type");
  }

  miniObject.id = object.id;
  miniObject.createdAt = object.createdAt;
  miniObject.updatedAt = object.updatedAt;
  miniObject.name = object.name;
  miniObject.isTemplate = object.isTemplate;
  miniObject.TemplateId = object.TemplateId;

  if (object.isTemplate) {
    if (object.Fields !== undefined) {
      miniObject.FieldIds = object.Fields.map((field: Field) => field.id);
    }
  } else {
    if (object.FieldData !== undefined) {
      miniObject.FieldDatumIds = object.FieldData.map(
        (fieldDatum: FieldDatum) => fieldDatum.id
      );
    }
  }
  if (object.Tags !== undefined) {
    miniObject.TagIds = object.Tags.map((tag: Tag) => tag.id);
  }

  return miniObject as T;
}
