import Account from "../database/models/Account";
import Entity from "../database/models/Entity";
import type Field from "../database/models/Field";
import type FieldDatum from "../database/models/FieldDatum";
import type FieldType from "../database/models/FieldType";
import type Group from "../database/models/Group";
import type Tag from "../database/models/Tag";
import Transaction from "../database/models/Transaction";
import type express from "express";

interface argObject {
  body?: string[];
  query?: string[];
  params?: string[];
}

export function hasRequestArguments(
  req: express.Request,
  res: express.Response,
  requiredArguments: argObject,
  minOneArguments?: argObject,
  exactlyOneArguments?: argObject
): boolean {
  let message = "";
  requiredArguments.body?.forEach((argName: string) => {
    if (req.body[argName] === undefined) {
      message = `Missing ${argName} in request body.`;
    }
  });
  requiredArguments.query?.forEach((argName: string) => {
    if (req.query[argName] === undefined) {
      message = `Missing ${argName} in request query.`;
    }
  });
  requiredArguments.params?.forEach((argName: string) => {
    if (req.params[argName] === undefined) {
      message = `Missing ${argName} in request params.`;
    }
  });
  if (
    minOneArguments?.body?.some((argName: string) => {
      return req.body[argName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneArguments.body.join(
      ", "
    )}] in request body.`;
  }
  if (
    minOneArguments?.query?.some((argName: string) => {
      return req.query[argName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneArguments.query.join(
      ", "
    )}] in request query.`;
  }
  if (
    minOneArguments?.params?.some((argName: string) => {
      return req.params[argName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneArguments.params.join(
      ", "
    )}] in request params.`;
  }
  if (exactlyOneArguments?.body !== undefined) {
    let paramCount = 0;
    exactlyOneArguments.body.forEach((argName: string) => {
      if (req.body[argName] !== undefined) {
        paramCount++;
      }
    });
    if (paramCount > 1) {
      message = `Can't have more than one of [${exactlyOneArguments.body.join(
        ", "
      )}] in request body.`;
    }
  }
  if (exactlyOneArguments?.params !== undefined) {
    let paramCount = 0;
    exactlyOneArguments.params.forEach((argName: string) => {
      if (req.body[argName] !== undefined) {
        paramCount++;
      }
    });
    if (paramCount > 1) {
      message = `Can't have more than one of [${exactlyOneArguments.params.join(
        ", "
      )}] in request params.`;
    }
  }
  if (exactlyOneArguments?.query !== undefined) {
    let paramCount = 0;
    exactlyOneArguments.query.forEach((argName: string) => {
      if (req.body[argName] !== undefined) {
        paramCount++;
      }
    });
    if (paramCount > 1) {
      message = `Can't have more than one of [${exactlyOneArguments.query.join(
        ", "
      )}] in request query.`;
    }
  }
  if (message !== "") {
    res.status(400).send({ message });
    return false;
  }
  return true;
}

export function isTemplatedUpsertRequest(
  req: express.Request,
  res: express.Response,
  isTemplate: boolean | undefined,
  templateId: number | undefined | null,
  requiredArguments?: argObject
): boolean {
  let message = "";
  if (isTemplate !== undefined && isTemplate) {
    if (templateId !== undefined) {
      message = "Cannot both be a Template and have a Template.";
    }
  } else {
    if (templateId === undefined) {
      message = "Must either be a Template or have a Template.";
    } else if (requiredArguments !== undefined) {
      return hasRequestArguments(req, res, requiredArguments);
    }
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
  object: Account | Entity | Transaction | Field | FieldType | Group
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
    throw new Error("can't minimize; unknown type");
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
