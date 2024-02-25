import * as AccountRepository from "../repositories/AccountRepository";
import * as FieldDatumService from "../services/FieldDatumService";
import {
  AccountDtoToModel,
  type AccountRequestDto,
  type AccountSearchRequestDto,
} from "../apiDtos/AccountDtos";
import {
  AccountTemplateDtoToModel,
  type AccountTemplateRequestDto,
  type AccountTemplateSearchRequestDto,
} from "../apiDtos/AccountTemplateDtos";
import { type Attributes, Op, type WhereOptions } from "sequelize";
import type Account from "../../database/models/Account";
import type FieldDatum from "../../database/models/FieldDatum";
import { defaultLimit } from "../../utils/constants";

export async function getAccount(accountId: number): Promise<Account | null> {
  const account = await AccountRepository.getAccount(accountId);
  return account;
}

export async function getAccountTemplate(
  accountTemplateId: number
): Promise<Account | null> {
  const accountTemplate = await AccountRepository.getAccountTemplate(
    accountTemplateId
  );
  return accountTemplate;
}

export async function getAccounts(
  accountSearchDto: AccountSearchRequestDto
): Promise<Account[]> {
  const whereOptions: WhereOptions<Attributes<Account>> = {
    isTemplate: false,
  };
  if (accountSearchDto.fieldIds != null) {
    whereOptions.FieldIds = {
      [Op.overlap]: accountSearchDto.fieldIds.map((id) => +id),
    };
  }
  if (accountSearchDto.fieldDatumIds != null) {
    whereOptions.FieldDatumIds = {
      [Op.overlap]: accountSearchDto.fieldDatumIds.map((id) => +id),
    };
  }
  if (accountSearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: accountSearchDto.name,
    };
  }
  if (accountSearchDto.parentGroupIds != null) {
    whereOptions.ParentGroupId = {
      [Op.in]: accountSearchDto.parentGroupIds.map((id) => +id),
    };
  }
  if (accountSearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: accountSearchDto.tagIds.map((id) => +id),
    };
  }
  if (accountSearchDto.templateIds != null) {
    whereOptions.TemplateId = {
      [Op.in]: accountSearchDto?.templateIds?.map((id) => +id),
    };
  }

  const searchLimit =
    accountSearchDto.limit != null ? +accountSearchDto.limit : defaultLimit;
  const searchOffset =
    accountSearchDto.offset != null ? +accountSearchDto.offset : 0;

  const accounts = await AccountRepository.getAccounts(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return accounts;
}

export async function getAccountTemplates(
  accountTemplateSearchDto: AccountTemplateSearchRequestDto
): Promise<Account[]> {
  const whereOptions: WhereOptions<Attributes<Account>> = {
    isTemplate: true,
  };
  if (accountTemplateSearchDto.fieldIds != null) {
    whereOptions.FieldIds = {
      [Op.overlap]: accountTemplateSearchDto.fieldIds.map((id) => +id),
    };
  }
  if (accountTemplateSearchDto.fieldDatumIds != null) {
    whereOptions.FieldDatumIds = {
      [Op.overlap]: accountTemplateSearchDto.fieldDatumIds.map((id) => +id),
    };
  }
  if (accountTemplateSearchDto.name != null) {
    whereOptions.name = {
      [Op.iLike]: accountTemplateSearchDto.name,
    };
  }
  if (accountTemplateSearchDto.parentGroupIds != null) {
    whereOptions.ParentGroupId = {
      [Op.in]: accountTemplateSearchDto.parentGroupIds.map((id) => +id),
    };
  }
  if (accountTemplateSearchDto.tagIds != null) {
    whereOptions.TagIds = {
      [Op.overlap]: accountTemplateSearchDto.tagIds.map((id) => +id),
    };
  }

  const searchLimit =
    accountTemplateSearchDto.limit != null
      ? +accountTemplateSearchDto.limit
      : defaultLimit;
  const searchOffset =
    accountTemplateSearchDto.offset != null
      ? +accountTemplateSearchDto.offset
      : 0;

  const accounts = await AccountRepository.getAccounts(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return accounts;
}

export async function createAccountFromDto(
  accountDto: AccountRequestDto
): Promise<Account> {
  const accountModel = AccountDtoToModel(accountDto);
  const account = await AccountRepository.createOrUpdateAccount(accountModel);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  accountDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createFieldDatumFromDto(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await account.setFieldData(fieldData.map((fieldDatum) => fieldDatum.id));

  await account.setTags(accountDto.tagIds);

  return account;
}

export async function createAccountTemplateFromDto(
  accountTemplateDto: AccountTemplateRequestDto
): Promise<Account> {
  const accountTemplateModel = AccountTemplateDtoToModel(accountTemplateDto);
  const accountTemplate = await AccountRepository.createOrUpdateAccount(
    accountTemplateModel
  );

  await accountTemplate.setFields(accountTemplateDto.fieldIds);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  accountTemplateDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createFieldDatumFromDto(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await accountTemplate.setFieldData(
    fieldData.map((fieldDatum) => fieldDatum.id)
  );

  await accountTemplate.setTags(accountTemplateDto.tagIds);

  return accountTemplate;
}

export async function updateAccountFromDto(
  id: number,
  accountDto: AccountRequestDto
): Promise<Account | null> {
  const accountModel = await getAccount(id);
  if (accountModel == null) {
    return null;
  }

  if (accountDto.templateId !== accountModel.TemplateId) {
    await FieldDatumService.deleteFieldDataByAccountId(id);
  }

  accountModel.set({
    name: accountDto.name,
    ParentGroupId: accountDto.parentGroupId,
    TemplateId: accountDto.templateId,
  });

  const account = await AccountRepository.createOrUpdateAccount(accountModel);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  accountDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createOrUpdateFieldDatum(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await account.setFieldData(fieldData.map((fieldDatum) => fieldDatum.id));

  await account.setTags(accountDto.tagIds);

  return account;
}

export async function updateAccountTemplateFromDto(
  id: number,
  accountTemplateDto: AccountTemplateRequestDto
): Promise<Account | null> {
  const accountTemplateModel = await getAccountTemplate(id);
  if (accountTemplateModel == null) {
    return null;
  }

  accountTemplateModel.set({
    name: accountTemplateDto.name,
    ParentGroupId: accountTemplateDto.parentGroupId,
  });

  const accountTemplate = await AccountRepository.createOrUpdateAccount(
    accountTemplateModel
  );

  await accountTemplate.setFields(accountTemplateDto.fieldIds);

  const fieldDataCreationPromises: Array<Promise<FieldDatum>> = [];
  accountTemplateDto.fieldData?.forEach((fieldDatumDto) => {
    fieldDataCreationPromises.push(
      FieldDatumService.createOrUpdateFieldDatum(fieldDatumDto)
    );
  });
  const fieldData = await Promise.all(fieldDataCreationPromises);
  await accountTemplate.setFieldData(
    fieldData.map((fieldDatum) => fieldDatum.id)
  );

  await accountTemplate.setTags(accountTemplateDto.tagIds);

  return accountTemplate;
}
