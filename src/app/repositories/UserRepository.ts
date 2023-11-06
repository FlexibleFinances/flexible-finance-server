import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import User from "../../database/models/User";

export async function getUser(userId: number): Promise<User | null> {
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  return user;
}

export async function getUsers(
  userWhereOptions: WhereOptions<Attributes<User>>,
  limit: number,
  offset: number
): Promise<User[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: userWhereOptions,
  };

  const users = await User.findAll(findOptions);

  return users;
}

export async function createOrUpdateUser(userModel: User): Promise<User> {
  const user = await userModel.save();
  return user;
}
