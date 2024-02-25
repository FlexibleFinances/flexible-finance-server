import * as UserRepository from "../repositories/UserRepository";
import { type Attributes, type WhereOptions } from "sequelize";
import {
  UserDtoToModel,
  type UserRequestDto,
  type UserSearchRequestDto,
} from "../apiDtos/UserDtos";
import type User from "../../database/models/User";
import { defaultLimit } from "../../utils/constants";

export async function getUser(userId: number): Promise<User | null> {
  const user = await UserRepository.getUser(userId);
  return user;
}

export async function getUsers(
  userSearchDto: UserSearchRequestDto
): Promise<User[]> {
  const whereOptions: WhereOptions<Attributes<User>> = {};

  const searchLimit =
    userSearchDto.limit != null ? +userSearchDto.limit : defaultLimit;
  const searchOffset = userSearchDto.offset != null ? +userSearchDto.offset : 0;

  const users = await UserRepository.getUsers(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return users;
}

export async function createUserFromDto(
  userDto: UserRequestDto
): Promise<User> {
  const userModel = UserDtoToModel(userDto);
  const user = await UserRepository.createOrUpdateUser(userModel);

  await user.setRoles(userDto.roleIds);

  return user;
}

export async function updateUserFromDto(
  id: number,
  userDto: UserRequestDto
): Promise<User | null> {
  const userModel = await getUser(id);
  if (userModel == null) {
    return null;
  }

  userModel.set({
    email: userDto.email,
    password: userDto.password,
    username: userDto.username,
  });

  const user = await UserRepository.createOrUpdateUser(userModel);

  await user.setRoles(userDto.roleIds);

  return user;
}
