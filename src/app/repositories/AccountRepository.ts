import {
  type AccountRequestDto,
  type AccountSearchRequestDto,
} from "../apiDtos/AccountDtos";
import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import Account from "../../database/models/Account";
import Field from "../../database/models/Field";
import FieldDatum from "../../database/models/FieldDatum";
import Group from "../../database/models/Group";
import Tag from "../../database/models/Tag";
import { defaultLimit } from "../../utils/constants";

export async function getAccountById(
  accountId: number
): Promise<Account | null> {
  const account = await Account.findOne({
    where: {
      id: accountId,
    },
    include: [Group, Field, FieldDatum, Tag],
  });
  return account;
}

export async function getAccountsByOptions(
  accountOptions: AccountSearchRequestDto
): Promise<Account[] | null> {
  const whereOptions: WhereOptions = {};
  if (accountOptions.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: accountOptions.name,
    };
  }
  if (accountOptions.isTemplate !== undefined) {
    whereOptions.isTemplate = {
      [Op.eq]: accountOptions.isTemplate as unknown as boolean,
    };
  }
  if (accountOptions.parentGroupIds !== undefined) {
    whereOptions.group = {
      [Op.in]: accountOptions.parentGroupIds.map((id) => +id),
    };
  }
  if (accountOptions.tagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: accountOptions.tagIds.map((id) => +id),
    };
  }
  if (accountOptions.templateIds !== undefined) {
    whereOptions.template = {
      [Op.in]: accountOptions.templateIds.map((id) => +id),
    };
  }

  const findOptions: FindOptions = {
    offset: +(accountOptions.offset ?? 0),
    limit: +(accountOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: [Group, Field, FieldDatum, Tag],
  };

  const accounts = await Account.findAll(findOptions);

  return accounts;
}

export async function createAccountFromDto(
  accountDto: AccountRequestDto
): Promise<Account | null> {
  const createOptions: CreationAttributes<Account> = {
    name: accountDto.name ?? "",
    GroupId: accountDto.parentGroupId,
    isTemplate: accountDto.isTemplate ?? false,
    TemplateId: accountDto.templateId,
  };
  const account = await Account.create(createOptions);

  if (createOptions.isTemplate) {
    if (accountDto.fieldIds !== undefined) {
      await account.setFields(accountDto.fieldIds);
    }
  } else if (accountDto.fieldValues !== undefined) {
    await FieldDatum.upsertFieldData(accountDto.fieldValues, account.id);
  }
  if (accountDto.tagIds !== undefined) {
    await account.setTags(accountDto.tagIds);
  }

  await account.loadAssociatedIds();

  return account;
}

export async function updateAccountFromDto(
  accountDto: AccountRequestDto
): Promise<Account | null> {
  const account = await Account.findOne({
    where: {
      id: accountDto.id,
    },
  });
  if (account === null) {
    return null;
  }
  const updateOptions: CreationAttributes<Account> = {
    name: accountDto.name ?? "",
    GroupId: accountDto.parentGroupId,
    isTemplate: accountDto.isTemplate ?? false,
    TemplateId: accountDto.templateId,
  };
  await account.update(updateOptions);

  if (updateOptions.isTemplate) {
    if (accountDto.fieldIds !== undefined) {
      await account.setFields(accountDto.fieldIds);
    }
  } else if (accountDto.fieldValues !== undefined) {
    await FieldDatum.upsertFieldData(accountDto.fieldValues, account.id);
  }
  if (accountDto.tagIds !== undefined) {
    await account.setTags(accountDto.tagIds);
  }

  await account.loadAssociatedIds();

  return account;
}
