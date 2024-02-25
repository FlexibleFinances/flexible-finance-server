import * as EntityService from "../services/EntityService";
import {
  type EntitiesResponse,
  type EntityRequest,
  type EntityResponse,
  EntityResponseDto,
  type EntitySearchRequest,
} from "../apiDtos/EntityDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getEntity(
  req: EntityRequest,
  res: EntityResponse
): Promise<void> {
  const entity = await EntityService.getEntity(Number(req.params.id));

  if (entity == null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }

  const entityResponseDto = new EntityResponseDto(entity);
  await entityResponseDto.loadAssociations(entity);

  res.status(200).send({
    message: "Entity gotten.",
    entity: entityResponseDto,
  });
}

export async function createEntity(
  req: EntityRequest,
  res: EntityResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const entity = await EntityService.createEntityFromDto(requestBody);

  if (entity == null) {
    res.status(500).send({
      message: "Entity not created.",
    });
    return;
  }

  const entityResponseDto = new EntityResponseDto(entity);
  await entityResponseDto.loadAssociations(entity);

  res.status(200).send({
    message: "Entity created.",
    entity: entityResponseDto,
  });
}

export async function updateEntity(
  req: EntityRequest,
  res: EntityResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (
    !hasRequestArguments(
      req,
      res,
      { params: ["id"] },
      { body: ["name", "groupId", "templateId"] }
    )
  ) {
    return;
  }

  const entity = await EntityService.updateEntityFromDto(
    Number(req.params.id),
    requestBody
  );

  if (entity == null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }

  const entityResponseDto = new EntityResponseDto(entity);
  await entityResponseDto.loadAssociations(entity);

  res.status(200).send({
    message: "Entity updated.",
    entity: entityResponseDto,
  });
}

export async function getEntities(
  req: EntitySearchRequest,
  res: EntitiesResponse
): Promise<void> {
  const requestQuery = req.query;

  const entities = await EntityService.getEntities(requestQuery);

  if (entities == null) {
    res.status(500).send({
      message: "Entities not found.",
    });
    return;
  }

  const entityResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const entityResponseDtos = entities.map((entity) => {
    const entityReponseDto = new EntityResponseDto(entity);
    entityResponseDtoAssocciationsPromises.push(
      entityReponseDto.loadAssociations(entity)
    );
    return entityReponseDto;
  });
  await Promise.all(entityResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Entities gotten.",
    entities: entityResponseDtos,
  });
}
