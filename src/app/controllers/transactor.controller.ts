import {
  type TransactorRequest,
  type TransactorResponse,
  TransactorResponseDto,
  type TransactorSearchRequest,
  type TransactorsResponse,
} from "../apiDtos/TransactorDtos";
import {
  createTransactorFromDto,
  getTransactorById,
  getTransactorsByOptions,
  updateTransactorFromDto,
} from "../repositories/TransactorRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getTransactor(
  req: TransactorRequest,
  res: TransactorResponse
): Promise<void> {
  const transactor = await getTransactorById(Number(req.params.transactorId));

  if (transactor === null) {
    res.status(500).send({
      message: "Transactor not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Transactor gotten.",
    transactor: new TransactorResponseDto(transactor),
  });
}

export async function createTransactor(
  req: TransactorRequest,
  res: TransactorResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const transactor = await createTransactorFromDto(requestBody);

  if (transactor === null) {
    res.status(500).send({
      message: "Transactor not created.",
    });
    return;
  }

  res.status(200).send({
    message: "Transactor created.",
    transactor: new TransactorResponseDto(transactor),
  });
}

export async function updateTransactor(
  req: TransactorRequest,
  res: TransactorResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (
    !hasRequestArguments(req, res, { params: ["TransactorId"] }, { body: [] })
  ) {
    return;
  }

  const transactor = await updateTransactorFromDto(requestBody);

  if (transactor === null) {
    res.status(500).send({
      message: "Transactor not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Transactor updated.",
    transactor: new TransactorResponseDto(transactor),
  });
}

export async function getTransactors(
  req: TransactorSearchRequest,
  res: TransactorsResponse
): Promise<void> {
  const requestQuery = req.query;

  const transactors = await getTransactorsByOptions(requestQuery);

  if (transactors === null) {
    res.status(500).send({
      message: "Transactors not found.",
    });
    return;
  }

  const transactorDtos = transactors.map(
    (transactor) => new TransactorResponseDto(transactor)
  );

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Transactor Templates gotten.",
      templates: transactorDtos,
    });
  } else {
    res.status(200).send({
      message: "Transactors gotten.",
      transactors: transactorDtos,
    });
  }
}
