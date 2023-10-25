import {
  type UserRequest,
  type UserResponse,
  UserResponseDto,
  type UserSearchRequest,
  type UsersResponse,
} from "../apiDtos/UserDtos";
import {
  createUserFromDto,
  getUserById,
  getUsersByOptions,
  updateUserFromDto,
} from "../repositories/UserRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getUser(
  req: UserRequest,
  res: UserResponse
): Promise<void> {
  const user = await getUserById(Number(req.params.id));

  if (user === null) {
    res.status(500).send({
      message: "User not found.",
    });
    return;
  }

  res.status(200).send({
    message: "User gotten.",
    user: new UserResponseDto(user),
  });
}

export async function createUser(
  req: UserRequest,
  res: UserResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const user = await createUserFromDto(requestBody);

  if (user === null) {
    res.status(500).send({
      message: "User not created.",
    });
    return;
  }

  res.status(200).send({
    message: "User created.",
    user: new UserResponseDto(user),
  });
}

export async function updateUser(
  req: UserRequest,
  res: UserResponse
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
      { params: ["id"] },
      { body: ["username", "email", "password", "roleIds"] }
    )
  ) {
    return;
  }

  const user = await updateUserFromDto(Number(req.params.id), requestBody);

  if (user === null) {
    res.status(500).send({
      message: "User not found.",
    });
    return;
  }

  res.status(200).send({
    message: "User updated.",
    user: new UserResponseDto(user),
  });
}

export async function getUsers(
  req: UserSearchRequest,
  res: UsersResponse
): Promise<void> {
  const requestQuery = req.query;

  const users = await getUsersByOptions(requestQuery);

  if (users === null) {
    res.status(500).send({
      message: "Users not found.",
    });
    return;
  }

  const userDtos = users.map((user) => new UserResponseDto(user));

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "User Templates gotten.",
      templates: userDtos,
    });
  } else {
    res.status(200).send({
      message: "Users gotten.",
      users: userDtos,
    });
  }
}
