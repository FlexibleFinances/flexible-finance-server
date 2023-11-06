import * as FieldDatumRepository from "../repositories/FieldDatumRepository";
import { type Attributes, Op, type WhereOptions } from "sequelize";
import {
  FieldDatumDtoToModel,
  type FieldDatumRequestDto,
  type FieldDatumSearchRequestDto,
} from "../apiDtos/FieldDatumDtos";
import type FieldDatum from "../../database/models/FieldDatum";
import { defaultLimit } from "../../utils/constants";

export async function getFieldDatum(
  fieldDatumId: number
): Promise<FieldDatum | null> {
  const fieldDatum = await FieldDatumRepository.getFieldDatum(fieldDatumId);
  return fieldDatum;
}

export async function getFieldData(
  fieldDatumSearchDto: FieldDatumSearchRequestDto
): Promise<FieldDatum[]> {
  const whereOptions: WhereOptions<Attributes<FieldDatum>> = {};
  if (fieldDatumSearchDto.fieldIds !== undefined) {
    whereOptions.FieldId = {
      [Op.in]: fieldDatumSearchDto.fieldIds.map((id) => +id),
    };
  }
  if (fieldDatumSearchDto.accountIds !== undefined) {
    whereOptions.AccountId = {
      [Op.in]: fieldDatumSearchDto.accountIds.map((id) => +id),
    };
  }
  if (fieldDatumSearchDto.entityIds !== undefined) {
    whereOptions.EntityId = {
      [Op.in]: fieldDatumSearchDto.entityIds.map((id) => +id),
    };
  }
  if (fieldDatumSearchDto.transactionIds !== undefined) {
    whereOptions.TransactionId = {
      [Op.in]: fieldDatumSearchDto.transactionIds.map((id) => +id),
    };
  }

  const searchLimit =
    fieldDatumSearchDto.limit !== undefined
      ? +fieldDatumSearchDto.limit
      : defaultLimit;
  const searchOffset =
    fieldDatumSearchDto.offset !== undefined ? +fieldDatumSearchDto.offset : 0;

  const fieldData = await FieldDatumRepository.getFieldData(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return fieldData;
}

export async function createFieldDatumFromDto(
  fieldDatumDto: FieldDatumRequestDto
): Promise<FieldDatum> {
  const fieldDatumModel = FieldDatumDtoToModel(fieldDatumDto);
  const fieldDatum = await FieldDatumRepository.createOrUpdateFieldDatum(
    fieldDatumModel
  );

  return fieldDatum;
}

export async function updateFieldDatumFromDto(
  id: number,
  fieldDatumDto: FieldDatumRequestDto
): Promise<FieldDatum | null> {
  const fieldDatumModel = await getFieldDatum(id);
  if (fieldDatumModel === null) {
    return null;
  }

  fieldDatumModel.set({
    FieldId: fieldDatumDto.fieldId,
    AccountId: fieldDatumDto.accountId,
    EntityId: fieldDatumDto.entityId,
    TransactionId: fieldDatumDto.transactionId,
    boolValue: fieldDatumDto.boolValue,
    dateValue: fieldDatumDto.dateValue,
    intValue: fieldDatumDto.intValue,
    stringValue: fieldDatumDto.stringValue,
  });

  const fieldDatum = await FieldDatumRepository.createOrUpdateFieldDatum(
    fieldDatumModel
  );

  return fieldDatum;
}

export async function createOrUpdateFieldDatum(
  fieldDatumDto: FieldDatumRequestDto
): Promise<FieldDatum> {
  const fieldDataSearchResult = await getFieldData({
    fieldIds: [fieldDatumDto.fieldId.toString()],
    accountIds:
      fieldDatumDto.accountId === undefined
        ? undefined
        : [fieldDatumDto.accountId.toString()],
    entityIds:
      fieldDatumDto.entityId === undefined
        ? undefined
        : [fieldDatumDto.entityId.toString()],
    transactionIds:
      fieldDatumDto.transactionId === undefined
        ? undefined
        : [fieldDatumDto.transactionId.toString()],
  });

  if (fieldDataSearchResult.length === 0) {
    return await createFieldDatumFromDto(fieldDatumDto);
  }

  const fieldDatumModel = fieldDataSearchResult[0];
  fieldDatumModel.set({
    FieldId: fieldDatumDto.fieldId,
    AccountId: fieldDatumDto.accountId,
    EntityId: fieldDatumDto.entityId,
    TransactionId: fieldDatumDto.transactionId,
    boolValue: fieldDatumDto.boolValue,
    dateValue: fieldDatumDto.dateValue,
    intValue: fieldDatumDto.intValue,
    stringValue: fieldDatumDto.stringValue,
  });

  const fieldDatum = await FieldDatumRepository.createOrUpdateFieldDatum(
    fieldDatumModel
  );
  return fieldDatum;
}

export async function deleteFieldDatumById(
  fieldDatumId: number
): Promise<void> {
  const whereOptions: WhereOptions<Attributes<FieldDatum>> = {
    id: fieldDatumId,
  };
  await FieldDatumRepository.deleteFieldData(whereOptions);
}

export async function deleteFieldDataByAccountId(
  accountId: number
): Promise<void> {
  const whereOptions: WhereOptions<Attributes<FieldDatum>> = {
    AccountId: accountId,
  };
  await FieldDatumRepository.deleteFieldData(whereOptions);
}

export async function deleteFieldDataByEntityId(
  entityId: number
): Promise<void> {
  const whereOptions: WhereOptions<Attributes<FieldDatum>> = {
    EntityId: entityId,
  };
  await FieldDatumRepository.deleteFieldData(whereOptions);
}

export async function deleteFieldDataByTransactionId(
  transactionId: number
): Promise<void> {
  const whereOptions: WhereOptions<Attributes<FieldDatum>> = {
    TransactionId: transactionId,
  };
  await FieldDatumRepository.deleteFieldData(whereOptions);
}
