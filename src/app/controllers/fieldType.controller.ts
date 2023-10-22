import {
  type FieldTypeRequest,
  type FieldTypeResponse,
  FieldTypeResponseDto,
  type FieldTypeSearchRequest,
  type FieldTypesResponse,
} from "../apiDtos/FieldTypeDtos";
import {
  createFieldTypeFromDto,
  getFieldTypeById,
  getFieldTypesByOptions,
  updateFieldTypeFromDto,
} from "../repositories/FieldTypeRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getFieldType(
  req: FieldTypeRequest,
  res: FieldTypeResponse
): Promise<void> {
  const fieldType = await getFieldTypeById(Number(req.params.fieldTypeId));

  if (fieldType === null) {
    res.status(500).send({
      message: "FieldType not found.",
    });
    return;
  }

  res.status(200).send({
    message: "FieldType gotten.",
    fieldType: new FieldTypeResponseDto(fieldType),
  });
}

export async function createFieldType(
  req: FieldTypeRequest,
  res: FieldTypeResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const fieldType = await createFieldTypeFromDto(requestBody);

  if (fieldType === null) {
    res.status(500).send({
      message: "FieldType not created.",
    });
    return;
  }

  res.status(200).send({
    message: "FieldType created.",
    fieldType: new FieldTypeResponseDto(fieldType),
  });
}

export async function updateFieldType(
  req: FieldTypeRequest,
  res: FieldTypeResponse
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
      { params: ["FieldTypeId"] },
      { body: ["name", "GroupId", "TemplateId", "fieldValues"] }
    )
  ) {
    return;
  }

  const fieldType = await updateFieldTypeFromDto(requestBody);

  if (fieldType === null) {
    res.status(500).send({
      message: "FieldType not found.",
    });
    return;
  }

  res.status(200).send({
    message: "FieldType updated.",
    fieldType: new FieldTypeResponseDto(fieldType),
  });
}

export async function getFieldTypes(
  req: FieldTypeSearchRequest,
  res: FieldTypesResponse
): Promise<void> {
  const requestQuery = req.query;

  const fieldTypes = await getFieldTypesByOptions(requestQuery);

  if (fieldTypes === null) {
    res.status(500).send({
      message: "FieldTypes not found.",
    });
    return;
  }

  const fieldTypeDtos = fieldTypes.map(
    (fieldType) => new FieldTypeResponseDto(fieldType)
  );

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "FieldType Templates gotten.",
      templates: fieldTypeDtos,
    });
  } else {
    res.status(200).send({
      message: "FieldTypes gotten.",
      fieldTypes: fieldTypeDtos,
    });
  }
}
