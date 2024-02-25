import * as RoleRepository from "../repositories/RoleRepository";
import { type Attributes, type WhereOptions } from "sequelize";
import {
  RoleDtoToModel,
  type RoleRequestDto,
  type RoleSearchRequestDto,
} from "../apiDtos/RoleDtos";
import type Role from "../../database/models/Role";
import { defaultLimit } from "../../utils/constants";

export async function getRole(roleId: number): Promise<Role | null> {
  const role = await RoleRepository.getRole(roleId);
  return role;
}

export async function getRoles(
  roleSearchDto: RoleSearchRequestDto
): Promise<Role[]> {
  const whereOptions: WhereOptions<Attributes<Role>> = {};

  const searchLimit =
    roleSearchDto.limit != null ? +roleSearchDto.limit : defaultLimit;
  const searchOffset = roleSearchDto.offset != null ? +roleSearchDto.offset : 0;

  const roles = await RoleRepository.getRoles(
    whereOptions,
    searchLimit,
    searchOffset
  );

  return roles;
}

export async function createRoleFromDto(
  roleDto: RoleRequestDto
): Promise<Role> {
  const roleModel = RoleDtoToModel(roleDto);
  const role = await RoleRepository.createOrUpdateRole(roleModel);

  await role.setUsers(roleDto.userIds);

  return role;
}

export async function updateRoleFromDto(
  id: number,
  roleDto: RoleRequestDto
): Promise<Role | null> {
  const roleModel = await getRole(id);
  if (roleModel == null) {
    return null;
  }

  roleModel.set({
    name: roleDto.name,
  });

  const role = await RoleRepository.createOrUpdateRole(roleModel);

  await role.setUsers(roleDto.userIds);

  return role;
}
