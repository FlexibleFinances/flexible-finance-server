import {
  type FieldRequest,
  type FieldResponse,
  FieldResponseDto,
  type FieldSearchRequest,
  type FieldsResponse,
} from "../apiDtos/FieldDtos";
import {
  createFieldFromDto,
  getFieldById,
  getFieldsByOptions,
  updateFieldFromDto,
} from "../repositories/FieldRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getField(
  req: FieldRequest,
  res: FieldResponse
): Promise<void> {
  const field = await getFieldById(Number(req.params.id));

  if (field === null) {
    res.status(500).send({
      message: "Field not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Field gotten.",
    field: new FieldResponseDto(field),
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

  const field = await createFieldFromDto(requestBody);

  if (field === null) {
    res.status(500).send({
      message: "Field not created.",
    });
    return;
  }

  res.status(200).send({
    message: "Field created.",
    field: new FieldResponseDto(field),
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

  if (!hasRequestArguments(req, res, { params: ["id"] }, { body: ["name"] })) {
    return;
  }

  const field = await updateFieldFromDto(Number(req.params.id), requestBody);

  if (field === null) {
    res.status(500).send({
      message: "Field not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Field updated.",
    field: new FieldResponseDto(field),
  });
}

export async function getFields(
  req: FieldSearchRequest,
  res: FieldsResponse
): Promise<void> {
  const requestQuery = req.query;

  const fields = await getFieldsByOptions(requestQuery);

  if (fields === null) {
    res.status(500).send({
      message: "Fields not found.",
    });
    return;
  }

  const fieldDtos = fields.map((field) => new FieldResponseDto(field));

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Field Templates gotten.",
      templates: fieldDtos,
    });
  } else {
    res.status(200).send({
      message: "Fields gotten.",
      fields: fieldDtos,
    });
  }
}
