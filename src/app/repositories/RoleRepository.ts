import {
  type Attributes,
  type FindOptions,
  type WhereOptions,
} from "sequelize";
import Role from "../../database/models/Role";

export async function getRole(roleId: number): Promise<Role | null> {
  const role = await Role.findOne({
    where: {
      id: roleId,
    },
  });
  return role;
}

export async function getRoles(
  roleWhereOptions: WhereOptions<Attributes<Role>>,
  limit: number,
  offset: number
): Promise<Role[]> {
  const findOptions: FindOptions = {
    limit: +limit,
    offset: +offset,
    where: roleWhereOptions,
  };

  const roles = await Role.findAll(findOptions);

  return roles;
}

export async function createOrUpdateRole(roleModel: Role): Promise<Role> {
  const role = await roleModel.save();
  return role;
}
