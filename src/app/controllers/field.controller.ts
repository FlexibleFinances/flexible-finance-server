import * as FieldService from "../services/FieldService";
import {
  type FieldRequest,
  type FieldResponse,
  FieldResponseDto,
  type FieldSearchRequest,
  type FieldsResponse,
} from "../apiDtos/FieldDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getField(
  req: FieldRequest,
  res: FieldResponse
): Promise<void> {
  const field = await FieldService.getField(Number(req.params.id));

  if (field === null) {
    res.status(500).send({
      message: "Field not found.",
    });
    return;
  }

  const fieldResponseDto = new FieldResponseDto(field);
  await fieldResponseDto.loadAssociations(field);

  res.status(200).send({
    message: "Field gotten.",
    field: fieldResponseDto,
  });
}

export async function createField(
  req: FieldRequest,
  res: FieldResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const field = await FieldService.createFieldFromDto(requestBody);

  if (field === null) {
    res.status(500).send({
      message: "Field not created.",
    });
    return;
  }

  const fieldResponseDto = new FieldResponseDto(field);
  await fieldResponseDto.loadAssociations(field);

  res.status(200).send({
    message: "Field created.",
    field: fieldResponseDto,
  });
}

export async function updateField(
  req: FieldRequest,
  res: FieldResponse
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
      { body: ["name", "fieldTypeId"] }
    )
  ) {
    return;
  }

  const field = await FieldService.updateFieldFromDto(
    Number(req.params.id),
    requestBody
  );

  if (field === null) {
    res.status(500).send({
      message: "Field not found.",
    });
    return;
  }

  const fieldResponseDto = new FieldResponseDto(field);
  await fieldResponseDto.loadAssociations(field);

  res.status(200).send({
    message: "Field updated.",
    field: fieldResponseDto,
  });
}

export async function getFields(
  req: FieldSearchRequest,
  res: FieldsResponse
): Promise<void> {
  const requestQuery = req.query;

  const fields = await FieldService.getFields(requestQuery);

  if (fields === null) {
    res.status(500).send({
      message: "Fields not found.",
    });
    return;
  }

  const fieldResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const fieldResponseDtos = fields.map((field) => {
    const fieldReponseDto = new FieldResponseDto(field);
    fieldResponseDtoAssocciationsPromises.push(
      fieldReponseDto.loadAssociations(field)
    );
    return fieldReponseDto;
  });
  await Promise.all(fieldResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Fields gotten.",
    fields: fieldResponseDtos,
  });
}
