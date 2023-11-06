import * as FieldDatumService from "../services/FieldDatumService";
import {
  type FieldDataResponse,
  type FieldDatumRequest,
  type FieldDatumResponse,
  FieldDatumResponseDto,
  type FieldDatumSearchRequest,
} from "../apiDtos/FieldDatumDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getFieldDatum(
  req: FieldDatumRequest,
  res: FieldDatumResponse
): Promise<void> {
  const fieldDatum = await FieldDatumService.getFieldDatum(
    Number(req.params.id)
  );

  if (fieldDatum === null) {
    res.status(500).send({
      message: "FieldDatum not found.",
    });
    return;
  }

  const fieldDatumResponseDto = new FieldDatumResponseDto(fieldDatum);
  await fieldDatumResponseDto.loadAssociations(fieldDatum);

  res.status(200).send({
    message: "FieldDatum gotten.",
    fieldDatum: fieldDatumResponseDto,
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

  const fieldDatum = await FieldDatumService.createFieldDatumFromDto(
    requestBody
  );

  if (fieldDatum === null) {
    res.status(500).send({
      message: "FieldDatum not created.",
    });
    return;
  }

  const fieldDatumResponseDto = new FieldDatumResponseDto(fieldDatum);
  await fieldDatumResponseDto.loadAssociations(fieldDatum);

  res.status(200).send({
    message: "FieldDatum created.",
    fieldDatum: fieldDatumResponseDto,
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
    !hasRequestArguments(req, res, { params: ["id"] }, { body: ["fieldId"] })
  ) {
    return;
  }

  const fieldDatum = await FieldDatumService.updateFieldDatumFromDto(
    Number(req.params.id),
    requestBody
  );

  if (fieldDatum === null) {
    res.status(500).send({
      message: "FieldDatum not found.",
    });
    return;
  }

  const fieldDatumResponseDto = new FieldDatumResponseDto(fieldDatum);
  await fieldDatumResponseDto.loadAssociations(fieldDatum);

  res.status(200).send({
    message: "FieldDatum updated.",
    fieldDatum: fieldDatumResponseDto,
  });
}

export async function getFieldData(
  req: FieldDatumSearchRequest,
  res: FieldDataResponse
): Promise<void> {
  const requestQuery = req.query;

  const fieldData = await FieldDatumService.getFieldData(requestQuery);

  if (fieldData === null) {
    res.status(500).send({
      message: "FieldData not found.",
    });
    return;
  }

  const fieldDatumResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const fieldDatumResponseDtos = fieldData.map((fieldDatum) => {
    const fieldDatumReponseDto = new FieldDatumResponseDto(fieldDatum);
    fieldDatumResponseDtoAssocciationsPromises.push(
      fieldDatumReponseDto.loadAssociations(fieldDatum)
    );
    return fieldDatumReponseDto;
  });
  await Promise.all(fieldDatumResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "FieldData gotten.",
    fieldData: fieldDatumResponseDtos,
  });
}
