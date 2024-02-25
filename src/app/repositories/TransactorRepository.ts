import {
  type CreationAttributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import {
  type TransactorRequestDto,
  type TransactorSearchRequestDto,
} from "../apiDtos/TransactorDtos";
import Transactor from "../../database/models/Transactor";
import { defaultLimit } from "../../utils/constants";

export async function getTransactorById(
  transactorId: number
): Promise<Transactor | null> {
  const transactor = await Transactor.findOne({
    where: {
      id: transactorId,
    },
    include: { all: true },
  });
  return transactor;
}

export async function getTransactorsByOptions(
  transactorOptions: TransactorSearchRequestDto
): Promise<Transactor[] | null> {
  const whereOptions: WhereOptions = {};

  const findOptions: FindOptions = {
    offset: +(transactorOptions.offset ?? 0),
    limit: +(transactorOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: { all: true },
  };

  const transactors = await Transactor.findAll(findOptions);

  return transactors;
}

export async function createTransactorFromDto(
  transactorDto: TransactorRequestDto
): Promise<Transactor | null> {
  const createOptions: CreationAttributes<Transactor> = {
    TransactorTypeId: transactorDto.transactorTypeId,
  };
  const transactor = await Transactor.create(createOptions);

  return transactor;
}

export async function updateTransactorFromDto(
  id: number,
  transactorDto: TransactorRequestDto
): Promise<Transactor | null> {
  const transactor = await Transactor.findOne({
    where: {
      id,
    },
  });
  if (transactor == null) {
    return null;
  }
  const updateOptions: CreationAttributes<Transactor> = {
    TransactorTypeId: transactorDto.transactorTypeId,
  };
  await transactor.update(updateOptions);

  return transactor;
}
