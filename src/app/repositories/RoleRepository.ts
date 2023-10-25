import {
  type CreationAttributes,
  type FindOptions,
  Op,
  type WhereOptions,
} from "sequelize";
import {
  type RoleRequestDto,
  type RoleSearchRequestDto,
} from "../apiDtos/RoleDtos";
import Role from "../../database/models/Role";
import { defaultLimit } from "../../utils/constants";

export async function getRoleById(roleId: number): Promise<Role | null> {
  const role = await Role.findOne({
    where: {
      id: roleId,
    },
    include: { all: true },
  });
  return role;
}

export async function getRolesByOptions(
  roleOptions: RoleSearchRequestDto
): Promise<Role[] | null> {
  const whereOptions: WhereOptions = {};
  if (roleOptions.name !== undefined) {
    whereOptions.name = {
      [Op.iLike]: roleOptions.name,
    };
  }
  if (roleOptions.isTemplate !== undefined) {
    whereOptions.isTemplate = {
      [Op.eq]: roleOptions.isTemplate as unknown as boolean,
    };
  }

  const findOptions: FindOptions = {
    offset: +(roleOptions.offset ?? 0),
    limit: +(roleOptions.limit ?? defaultLimit),
    where: whereOptions,
    include: { all: true },
  };

  const roles = await Role.findAll(findOptions);

  return roles;
}

export async function createRoleFromDto(
  roleDto: RoleRequestDto
): Promise<Role | null> {
  const createOptions: CreationAttributes<Role> = {
    name: roleDto.name ?? "",
  };
  const role = await Role.create(createOptions);

  return role;
}

export async function updateRoleFromDto(
  id: number,
  roleDto: RoleRequestDto
): Promise<Role | null> {
  const role = await Role.findOne({
    where: {
      id,
    },
  });
  if (role === null) {
    return null;
  }
  const updateOptions: CreationAttributes<Role> = {
    name: roleDto.name ?? "",
  };
  await role.update(updateOptions);

  return role;
}
