import * as UserService from "../services/UserService";
import {
  type UserRequest,
  type UserResponse,
  UserResponseDto,
  type UserSearchRequest,
  type UsersResponse,
} from "../apiDtos/UserDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getUser(
  req: UserRequest,
  res: UserResponse
): Promise<void> {
  const user = await UserService.getUser(Number(req.params.id));

  if (user == null) {
    res.status(500).send({
      message: "User not found.",
    });
    return;
  }

  const userResponseDto = new UserResponseDto(user);
  await userResponseDto.loadAssociations(user);

  res.status(200).send({
    message: "User gotten.",
    user: userResponseDto,
  });
}

export async function createUser(
  req: UserRequest,
  res: UserResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const user = await UserService.createUserFromDto(requestBody);

  if (user == null) {
    res.status(500).send({
      message: "User not created.",
    });
    return;
  }

  const userResponseDto = new UserResponseDto(user);
  await userResponseDto.loadAssociations(user);

  res.status(200).send({
    message: "User created.",
    user: userResponseDto,
  });
}

export async function updateUser(
  req: UserRequest,
  res: UserResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody == null) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (
    !hasRequestArguments(req, res, { params: ["id"] }, { body: ["username"] })
  ) {
    return;
  }

  const user = await UserService.updateUserFromDto(
    Number(req.params.id),
    requestBody
  );

  if (user == null) {
    res.status(500).send({
      message: "User not found.",
    });
    return;
  }

  const userResponseDto = new UserResponseDto(user);
  await userResponseDto.loadAssociations(user);

  res.status(200).send({
    message: "User updated.",
    user: userResponseDto,
  });
}

export async function getUsers(
  req: UserSearchRequest,
  res: UsersResponse
): Promise<void> {
  const requestQuery = req.query;

  const users = await UserService.getUsers(requestQuery);

  if (users == null) {
    res.status(500).send({
      message: "Users not found.",
    });
    return;
  }

  const userResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const userResponseDtos = users.map((user) => {
    const userReponseDto = new UserResponseDto(user);
    userResponseDtoAssocciationsPromises.push(
      userReponseDto.loadAssociations(user)
    );
    return userReponseDto;
  });
  await Promise.all(userResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Users gotten.",
    users: userResponseDtos,
  });
}
