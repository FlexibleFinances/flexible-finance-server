import { CreationAttributes, FindOptions, Op, WhereOptions } from "sequelize";
import FieldDatum, { FieldValues } from "../../database/models/FieldDatum";
import {
  hasRequestArguments,
  minimizeAssociationsToIds,
} from "../../utils/helperFunctions";
import Entity from "../../database/models/Entity";
import Field from "../../database/models/Field";
import Tag from "../../database/models/Tag";
import { defaultLimit } from "../../utils/constants";
import express from "express";

export async function getEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (!hasRequestArguments(req, res, { params: ["EntityId"] })) {
    return;
  }

  const entity = await Entity.findOne({
    where: {
      id: req.params.EntityId,
    },
    include: [Field, FieldDatum, Tag],
  });
  if (entity === null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }

  minimizeAssociationsToIds(entity);

  res.status(200).send({
    message: "Entity gotten.",
    entity,
  });
}

export async function createEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(
      req,
      res,
      { body: ["name"] },
      { body: ["TemplateId", "isTemplate"] }
    )
  ) {
    return;
  }

  const createOptions: CreationAttributes<Entity> = {
    name: req.body.name,
    TemplateId: req.body.TemplateId,
    isTemplate: req.body.isTemplate,
    GroupId: req.body.GroupId,
  };

  const entity = await Entity.create(createOptions);

  if (createOptions.isTemplate) {
    if (req.body.FieldIds !== undefined) {
      await entity.addFields(req.body.FieldIds as number[]);
    }
  } else {
    await FieldDatum.upsertFieldData(
      req.body.fieldValues as FieldValues,
      undefined,
      entity.id
    );
  }

  await entity.loadAssociatedIds();

  res.status(200).send({ message: "Entity created.", entity });
}

export async function updateEntity(
  req: express.Request,
  res: express.Response
): Promise<void> {
  if (
    !hasRequestArguments(
      req,
      res,
      { params: ["EntityId"] },
      { body: ["name", "fieldValues", "GroupId", "TemplateId"] }
    )
  ) {
    return;
  }

  const entity = await Entity.findOne({
    where: {
      id: req.params.EntityId,
    },
  });
  if (entity === null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }
  const updateOptions: CreationAttributes<Entity> = {
    name: req.body.name,
    GroupId: req.body.GroupId,
    TemplateId: req.body.TemplateId,
    isTemplate: entity.isTemplate,
  };
  await entity.update(updateOptions);

  if (updateOptions.isTemplate) {
    if (req.body.FieldIds !== undefined) {
      await entity.setFields(req.body.FieldIds as number[]);
    }
  } else {
    await FieldDatum.upsertFieldData(
      req.body.fieldValues as FieldValues,
      undefined,
      entity.id
    );
  }

  await entity.loadAssociatedIds();

  res.status(200).send({
    message: "Entity updated.",
    entity,
  });
}

export async function getEntities(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const whereOptions: WhereOptions = {};
  if (req.query.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: req.body.name,
    };
  }
  if (req.query.isTemplate !== undefined) {
    whereOptions.isTemplate = {
      [Op.eq]: req.query.isTemplate as unknown as boolean,
    };
  }
  if (req.query.GroupIds !== undefined) {
    whereOptions.group = {
      [Op.in]: (req.query.GroupIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.TagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: (req.query.TagIds as string[]).map((x) => {
        return +x;
      }),
    };
  }
  if (req.query.TemplateIds !== undefined) {
    whereOptions.template = {
      [Op.in]: (req.query.TemplateIds as string[]).map((x) => {
        return +x;
      }),
    };
  }

  const findOptions: FindOptions = {
    offset: +(req.query.offset ?? 0),
    limit: +(req.query.limit ?? defaultLimit),
    where: whereOptions,
    include: [Field, FieldDatum, Tag],
  };
  const entities = await Entity.findAll(findOptions);

  const minimizedEntities: Entity[] = [];
  entities.forEach((entity) => {
    minimizedEntities.push(minimizeAssociationsToIds(entity));
  });

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Entity Templates gotten.",
      templates: minimizedEntities,
    });
  } else {
    res.status(200).send({
      message: "Entities gotten.",
      entities: minimizedEntities,
    });
  }
}
