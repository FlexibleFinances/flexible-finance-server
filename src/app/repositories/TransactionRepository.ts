import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type TransactionRequestDto,
  type TransactionSearchRequestDto,
} from "../apiDtos/TransactionDtos";
import Field from "../../database/models/Field";
import FieldDatum from "../../database/models/FieldDatum";
import Tag from "../../database/models/Tag";
import Transaction from "../../database/models/Transaction";
import { defaultLimit } from "../../utils/constants";

export async function getTransactionById(
  transactionId: number
): Promise<Transaction | null> {
  const transaction = await Transaction.findOne({
    where: {
      id: transactionId,
    },
    include: [Field, FieldDatum, Tag],
  });
  return transaction;
}

export async function getTransactionsByOptions(
  transactionOptions: TransactionSearchRequestDto
): Promise<Transaction[] | null> {
  const whereOptions: WhereOptions = {};
  if (transactionOptions.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: transactionOptions.name,
    };
  }
  if (transactionOptions.isTemplate !== undefined) {
    whereOptions.isTemplate = {
      [Op.eq]: transactionOptions.isTemplate as unknown as boolean,
    };
  }
  if (transactionOptions.tagIds !== undefined) {
    whereOptions.tags = {
      [Op.in]: transactionOptions.tagIds.map((id) => +id),
    };
  }
  if (transactionOptions.templateIds !== undefined) {
    whereOptions.template = {
      [Op.in]: transactionOptions.templateIds.map((id) => +id),
    };
  }

  const findOptions: FindOptions = {
    offset: +(transactionOptions.offset ?? 0),
    limit: +(transactionOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: [Field, FieldDatum, Tag],
  };

  const transactions = await Transaction.findAll(findOptions);

  return transactions;
}

export async function createTransactionFromDto(
  transactionDto: TransactionRequestDto
): Promise<Transaction | null> {
  const createOptions: CreationAttributes<Transaction> = {
    name: transactionDto.name ?? "",
    isTemplate: transactionDto.isTemplate ?? false,
    TemplateId: transactionDto.templateId,
  };
  const transaction = await Transaction.create(createOptions);

  if (createOptions.isTemplate) {
    if (transactionDto.fieldIds !== undefined) {
      await transaction.setFields(transactionDto.fieldIds);
    }
  } else if (transactionDto.fieldValues !== undefined) {
    await FieldDatum.upsertFieldData(
      transactionDto.fieldValues,
      transaction.id
    );
  }
  if (transactionDto.tagIds !== undefined) {
    await transaction.setTags(transactionDto.tagIds);
  }

  await transaction.loadAssociatedIds();

  return transaction;
}

export async function updateTransactionFromDto(
  transactionDto: TransactionRequestDto
): Promise<Transaction | null> {
  const transaction = await Transaction.findOne({
    where: {
      id: transactionDto.id,
    },
  });
  if (transaction === null) {
    return null;
  }
  const updateOptions: CreationAttributes<Transaction> = {
    name: transactionDto.name ?? "",
    isTemplate: transactionDto.isTemplate ?? false,
    TemplateId: transactionDto.templateId,
  };
  await transaction.update(updateOptions);

  if (updateOptions.isTemplate) {
    if (transactionDto.fieldIds !== undefined) {
      await transaction.setFields(transactionDto.fieldIds);
    }
  } else if (transactionDto.fieldValues !== undefined) {
    await FieldDatum.upsertFieldData(
      transactionDto.fieldValues,
      transaction.id
    );
  }
  if (transactionDto.tagIds !== undefined) {
    await transaction.setTags(transactionDto.tagIds);
  }

  await transaction.loadAssociatedIds();

  return transaction;
}
