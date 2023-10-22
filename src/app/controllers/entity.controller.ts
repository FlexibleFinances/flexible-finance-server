import {
  type EntitiesResponse,
  type EntityRequest,
  type EntityResponse,
  EntityResponseDto,
  type EntitySearchRequest,
} from "../apiDtos/EntityDtos";
import {
  createEntityFromDto,
  getEntitiesByOptions,
  getEntityById,
  updateEntityFromDto,
} from "../repositories/EntityRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getEntity(
  req: EntityRequest,
  res: EntityResponse
): Promise<void> {
  const entity = await getEntityById(Number(req.params.entityId));

  if (entity === null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Entity gotten.",
    entity: new EntityResponseDto(entity),
  });
}

export async function createEntity(
  req: EntityRequest,
  res: EntityResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const entity = await createEntityFromDto(requestBody);

  if (entity === null) {
    res.status(500).send({
      message: "Entity not created.",
    });
    return;
  }

  res.status(200).send({
    message: "Entity created.",
    entity: new EntityResponseDto(entity),
  });
}

export async function updateEntity(
  req: EntityRequest,
  res: EntityResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (
    !hasRequestArguments(
      req,
      res,
      { params: ["EntityId"] },
      { body: ["name", "GroupId", "TemplateId", "fieldValues"] }
    )
  ) {
    return;
  }

  const entity = await updateEntityFromDto(requestBody);

  if (entity === null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Entity updated.",
    entity: new EntityResponseDto(entity),
  });
}

export async function getEntities(
  req: EntitySearchRequest,
  res: EntitiesResponse
): Promise<void> {
  const requestQuery = req.query;

  const entities = await getEntitiesByOptions(requestQuery);

  if (entities === null) {
    res.status(500).send({
      message: "Entities not found.",
    });
    return;
  }

  const entityDtos = entities.map((entity) => new EntityResponseDto(entity));

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Entity Templates gotten.",
      templates: entityDtos,
    });
  } else {
    res.status(200).send({
      message: "Entities gotten.",
      entities: entityDtos,
    });
  }
}
