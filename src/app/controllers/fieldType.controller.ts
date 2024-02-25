import * as FieldTypeService from "../services/FieldTypeService";
import {
  type FieldTypeRequest,
  type FieldTypeResponse,
  FieldTypeResponseDto,
  type FieldTypeSearchRequest,
  type FieldTypesResponse,
} from "../apiDtos/FieldTypeDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getFieldType(
  req: FieldTypeRequest,
  res: FieldTypeResponse
): Promise<void> {
  const fieldType = await FieldTypeService.getFieldType(Number(req.params.id));

  if (fieldType == null) {
    res.status(500).send({
      message: "FieldType not found.",
    });
    return;
  }

  const fieldTypeResponseDto = new FieldTypeResponseDto(fieldType);
  await fieldTypeResponseDto.loadAssociations(fieldType);

  res.status(200).send({
    message: "FieldType gotten.",
    fieldType: fieldTypeResponseDto,
  });
}

export async function createFieldType(
  req: FieldTypeRequest,
  res: FieldTypeResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const fieldType = await FieldTypeService.createFieldTypeFromDto(requestBody);

  if (fieldType == null) {
    res.status(500).send({
      message: "FieldType not created.",
    });
    return;
  }

  const fieldTypeResponseDto = new FieldTypeResponseDto(fieldType);
  await fieldTypeResponseDto.loadAssociations(fieldType);

  res.status(200).send({
    message: "FieldType created.",
    fieldType: fieldTypeResponseDto,
  });
}

export async function updateFieldType(
  req: FieldTypeRequest,
  res: FieldTypeResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (!hasRequestArguments(req, res, { params: ["id"] }, { body: ["name"] })) {
    return;
  }

  const fieldType = await FieldTypeService.updateFieldTypeFromDto(
    Number(req.params.id),
    requestBody
  );

  if (fieldType == null) {
    res.status(500).send({
      message: "FieldType not found.",
    });
    return;
  }

  const fieldTypeResponseDto = new FieldTypeResponseDto(fieldType);
  await fieldTypeResponseDto.loadAssociations(fieldType);

  res.status(200).send({
    message: "FieldType updated.",
    fieldType: fieldTypeResponseDto,
  });
}

export async function getFieldTypes(
  req: FieldTypeSearchRequest,
  res: FieldTypesResponse
): Promise<void> {
  const requestQuery = req.query;

  const fieldTypes = await FieldTypeService.getFieldTypes(requestQuery);

  if (fieldTypes == null) {
    res.status(500).send({
      message: "FieldTypes not found.",
    });
    return;
  }

  const fieldTypeResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const fieldTypeResponseDtos = fieldTypes.map((fieldType) => {
    const fieldTypeReponseDto = new FieldTypeResponseDto(fieldType);
    fieldTypeResponseDtoAssocciationsPromises.push(
      fieldTypeReponseDto.loadAssociations(fieldType)
    );
    return fieldTypeReponseDto;
  });
  await Promise.all(fieldTypeResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "FieldTypes gotten.",
    fieldTypes: fieldTypeResponseDtos,
  });
}
