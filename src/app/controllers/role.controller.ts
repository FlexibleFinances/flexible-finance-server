import {
  type RoleRequest,
  type RoleResponse,
  RoleResponseDto,
  type RoleSearchRequest,
  type RolesResponse,
} from "../apiDtos/RoleDtos";
import {
  createRoleFromDto,
  getRoleById,
  getRolesByOptions,
  updateRoleFromDto,
} from "../repositories/RoleRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getRole(
  req: RoleRequest,
  res: RoleResponse
): Promise<void> {
  const role = await getRoleById(Number(req.params.id));

  if (role === null) {
    res.status(500).send({
      message: "Role not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Role gotten.",
    role: new RoleResponseDto(role),
  });
}

export async function createRole(
  req: RoleRequest,
  res: RoleResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const role = await createRoleFromDto(requestBody);

  if (role === null) {
    res.status(500).send({
      message: "Role not created.",
    });
    return;
  }

  res.status(200).send({
    message: "Role created.",
    role: new RoleResponseDto(role),
  });
}

export async function updateRole(
  req: RoleRequest,
  res: RoleResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  if (!hasRequestArguments(req, res, { params: ["id"] }, { body: ["name"] })) {
    return;
  }

  const role = await updateRoleFromDto(Number(req.params.id), requestBody);

  if (role === null) {
    res.status(500).send({
      message: "Role not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Role updated.",
    role: new RoleResponseDto(role),
  });
}

export async function getRoles(
  req: RoleSearchRequest,
  res: RolesResponse
): Promise<void> {
  const requestQuery = req.query;

  const roles = await getRolesByOptions(requestQuery);

  if (roles === null) {
    res.status(500).send({
      message: "Roles not found.",
    });
    return;
  }

  const roleDtos = roles.map((role) => new RoleResponseDto(role));

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Role Templates gotten.",
      templates: roleDtos,
    });
  } else {
    res.status(200).send({
      message: "Roles gotten.",
      roles: roleDtos,
    });
  }
}
