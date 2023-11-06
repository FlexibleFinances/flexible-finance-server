import * as RoleService from "../services/RoleService";
import {
  type RoleRequest,
  type RoleResponse,
  RoleResponseDto,
  type RoleSearchRequest,
  type RolesResponse,
} from "../apiDtos/RoleDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getRole(
  req: RoleRequest,
  res: RoleResponse
): Promise<void> {
  const role = await RoleService.getRole(Number(req.params.id));

  if (role === null) {
    res.status(500).send({
      message: "Role not found.",
    });
    return;
  }

  const roleResponseDto = new RoleResponseDto(role);
  await roleResponseDto.loadAssociations(role);

  res.status(200).send({
    message: "Role gotten.",
    role: roleResponseDto,
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

  const role = await RoleService.createRoleFromDto(requestBody);

  if (role === null) {
    res.status(500).send({
      message: "Role not created.",
    });
    return;
  }

  const roleResponseDto = new RoleResponseDto(role);
  await roleResponseDto.loadAssociations(role);

  res.status(200).send({
    message: "Role created.",
    role: roleResponseDto,
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

  const role = await RoleService.updateRoleFromDto(
    Number(req.params.id),
    requestBody
  );

  if (role === null) {
    res.status(500).send({
      message: "Role not found.",
    });
    return;
  }

  const roleResponseDto = new RoleResponseDto(role);
  await roleResponseDto.loadAssociations(role);

  res.status(200).send({
    message: "Role updated.",
    role: roleResponseDto,
  });
}

export async function getRoles(
  req: RoleSearchRequest,
  res: RolesResponse
): Promise<void> {
  const requestQuery = req.query;

  const roles = await RoleService.getRoles(requestQuery);

  if (roles === null) {
    res.status(500).send({
      message: "Roles not found.",
    });
    return;
  }

  const roleResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const roleResponseDtos = roles.map((role) => {
    const roleReponseDto = new RoleResponseDto(role);
    roleResponseDtoAssocciationsPromises.push(
      roleReponseDto.loadAssociations(role)
    );
    return roleReponseDto;
  });
  await Promise.all(roleResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Roles gotten.",
    roles: roleResponseDtos,
  });
}
