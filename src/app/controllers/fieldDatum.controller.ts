import {
  type FieldDataResponse,
  type FieldDatumRequest,
  type FieldDatumResponse,
  FieldDatumResponseDto,
  type FieldDatumSearchRequest,
} from "../apiDtos/FieldDatumDtos";
import {
  createFieldDatumFromDto,
  getFieldDataByOptions,
  getFieldDatumById,
  updateFieldDatumFromDto,
} from "../repositories/FieldDatumRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getFieldDatum(
  req: FieldDatumRequest,
  res: FieldDatumResponse
): Promise<void> {
  const fieldDatum = await getFieldDatumById(Number(req.params.fieldDatumId));

  if (fieldDatum === null) {
    res.status(500).send({
      message: "FieldDatum not found.",
    });
    return;
  }

  res.status(200).send({
    message: "FieldDatum gotten.",
    fieldDatum: new FieldDatumResponseDto(fieldDatum),
  });
}

export async function createFieldDatum(
  req: FieldDatumRequest,
  res: FieldDatumResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const fieldDatum = await createFieldDatumFromDto(requestBody);

  if (fieldDatum === null) {
    res.status(500).send({
      message: "FieldDatum not created.",
    });
    return;
  }

  res.status(200).send({
    message: "FieldDatum created.",
    fieldDatum: new FieldDatumResponseDto(fieldDatum),
  });
}

export async function updateFieldDatum(
  req: FieldDatumRequest,
  res: FieldDatumResponse
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
      { params: ["FieldDatumId"] },
      { body: ["name", "GroupId", "TemplateId", "fieldValues"] }
    )
  ) {
    return;
  }

  const fieldDatum = await updateFieldDatumFromDto(requestBody);

  if (fieldDatum === null) {
    res.status(500).send({
      message: "FieldDatum not found.",
    });
    return;
  }

  res.status(200).send({
    message: "FieldDatum updated.",
    fieldDatum: new FieldDatumResponseDto(fieldDatum),
  });
}

export async function getFieldData(
  req: FieldDatumSearchRequest,
  res: FieldDataResponse
): Promise<void> {
  const requestQuery = req.query;

  const fieldData = await getFieldDataByOptions(requestQuery);

  if (fieldData === null) {
    res.status(500).send({
      message: "FieldData not found.",
    });
    return;
  }

  const fieldDatumDtos = fieldData.map(
    (fieldDatum) => new FieldDatumResponseDto(fieldDatum)
  );

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "FieldDatum Templates gotten.",
      templates: fieldDatumDtos,
    });
  } else {
    res.status(200).send({
      message: "FieldData gotten.",
      fieldData: fieldDatumDtos,
    });
  }
}
