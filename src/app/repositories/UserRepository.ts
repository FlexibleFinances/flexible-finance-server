import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type UserRequestDto,
  type UserSearchRequestDto,
} from "../apiDtos/UserDtos";
import User from "../../database/models/User";
import { defaultLimit } from "../../utils/constants";

export async function getUserById(userId: number): Promise<User | null> {
  const user = await User.findOne({
    where: {
      id: userId,
    },
    include: { all: true },
  });
  return user;
}

export async function getUsersByOptions(
  userOptions: UserSearchRequestDto
): Promise<User[] | null> {
  const whereOptions: WhereOptions = {};
  if (userOptions.username !== undefined) {
    whereOptions.username = {
      [Op.iLike]: userOptions.username,
    };
  }
  if (userOptions.email !== undefined) {
    whereOptions.email = {
      [Op.iLike]: userOptions.email,
    };
  }
  if (userOptions.roleIds !== undefined) {
    whereOptions.role = {
      [Op.in]: userOptions.roleIds.map((id) => +id),
    };
  }

  const findOptions: FindOptions = {
    offset: +(userOptions.offset ?? 0),
    limit: +(userOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: { all: true },
  };

  const users = await User.findAll(findOptions);

  return users;
}

export async function createUserFromDto(
  userDto: UserRequestDto
): Promise<User | null> {
  const createOptions: CreationAttributes<User> = {
    username: userDto.username ?? "",
    email: userDto.email ?? "",
    password: userDto.password ?? "",
  };
  const user = await User.create(createOptions);

  if (userDto.roleIds !== undefined) {
    await user.setRoles(userDto.roleIds);
  }

  return user;
}

export async function updateUserFromDto(
  userDto: UserRequestDto
): Promise<User | null> {
  const user = await User.findOne({
    where: {
      id: userDto.id,
    },
  });
  if (user === null) {
    return null;
  }
  const updateOptions: CreationAttributes<User> = {
    username: userDto.username ?? "",
    email: userDto.email ?? "",
    password: userDto.password ?? "",
  };
  await user.update(updateOptions);

  if (userDto.roleIds !== undefined) {
    await user.setRoles(userDto.roleIds);
  }

  return user;
}
