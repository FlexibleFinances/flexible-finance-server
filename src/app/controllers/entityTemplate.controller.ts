import * as EntityService from "../services/EntityService";
import {
  type EntityTemplateRequest,
  type EntityTemplateResponse,
  EntityTemplateResponseDto,
  type EntityTemplateSearchRequest,
  type EntityTemplatesResponse,
} from "../apiDtos/EntityTemplateDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getEntityTemplate(
  req: EntityTemplateRequest,
  res: EntityTemplateResponse
): Promise<void> {
  const entityTemplate = await EntityService.getEntityTemplate(
    Number(req.params.id)
  );

  if (entityTemplate === null) {
    res.status(500).send({
      message: "Entity not found.",
    });
    return;
  }

  const entityTemplateResponseDto = new EntityTemplateResponseDto(
    entityTemplate
  );
  await entityTemplateResponseDto.loadAssociations(entityTemplate);

  res.status(200).send({
    message: "Entity Template gotten.",
    entityTemplate: entityTemplateResponseDto,
  });
}

export async function createEntityTemplate(
  req: EntityTemplateRequest,
  res: EntityTemplateResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const entityTemplate = await EntityService.createEntityTemplateFromDto(
    requestBody
  );

  if (entityTemplate === null) {
    res.status(500).send({
      message: "Entity Template not created.",
    });
    return;
  }

  const entityTemplateResponseDto = new EntityTemplateResponseDto(
    entityTemplate
  );
  await entityTemplateResponseDto.loadAssociations(entityTemplate);

  res.status(200).send({
    message: "Entity Template created.",
    entityTemplate: entityTemplateResponseDto,
  });
}

export async function updateEntityTemplate(
  req: EntityTemplateRequest,
  res: EntityTemplateResponse
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
      { params: ["id"] },
      { body: ["name", "groupId"] }
    )
  ) {
    return;
  }

  const entityTemplate = await EntityService.updateEntityTemplateFromDto(
    Number(req.params.id),
    requestBody
  );

  if (entityTemplate === null) {
    res.status(500).send({
      message: "Entity Template not found.",
    });
    return;
  }

  const entityTemplateResponseDto = new EntityTemplateResponseDto(
    entityTemplate
  );
  await entityTemplateResponseDto.loadAssociations(entityTemplate);

  res.status(200).send({
    message: "Entity Template updated.",
    entityTemplate: entityTemplateResponseDto,
  });
}

export async function getEntityTemplates(
  req: EntityTemplateSearchRequest,
  res: EntityTemplatesResponse
): Promise<void> {
  const requestQuery = req.query;

  const entityTemplates = await EntityService.getEntityTemplates(requestQuery);

  if (entityTemplates === null) {
    res.status(500).send({
      message: "Entity Templates not found.",
    });
    return;
  }

  const entityTemplateResponseDtoAssocciationsPromises: Array<Promise<void>> =
    [];
  const entityTemplateResponseDtos = entityTemplates.map((entityTemplate) => {
    const entityTemplateReponseDto = new EntityTemplateResponseDto(
      entityTemplate
    );
    entityTemplateResponseDtoAssocciationsPromises.push(
      entityTemplateReponseDto.loadAssociations(entityTemplate)
    );
    return entityTemplateReponseDto;
  });
  await Promise.all(entityTemplateResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Entity Templates gotten.",
    entityTemplates: entityTemplateResponseDtos,
  });
}
