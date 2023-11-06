import * as GroupService from "../services/GroupService";
import {
  type GroupRequest,
  type GroupResponse,
  GroupResponseDto,
  type GroupSearchRequest,
  type GroupsResponse,
} from "../apiDtos/GroupDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getGroup(
  req: GroupRequest,
  res: GroupResponse
): Promise<void> {
  const group = await GroupService.getGroup(Number(req.params.id));

  if (group === null) {
    res.status(500).send({
      message: "Group not found.",
    });
    return;
  }

  const groupResponseDto = new GroupResponseDto(group);
  await groupResponseDto.loadAssociations(group);

  res.status(200).send({
    message: "Group gotten.",
    group: groupResponseDto,
  });
}

export async function createGroup(
  req: GroupRequest,
  res: GroupResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const group = await GroupService.createGroupFromDto(requestBody);

  if (group === null) {
    res.status(500).send({
      message: "Group not created.",
    });
    return;
  }

  const groupResponseDto = new GroupResponseDto(group);
  await groupResponseDto.loadAssociations(group);

  res.status(200).send({
    message: "Group created.",
    group: groupResponseDto,
  });
}

export async function updateGroup(
  req: GroupRequest,
  res: GroupResponse
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
      { body: ["name", "parentGroupId"] }
    )
  ) {
    return;
  }

  const group = await GroupService.updateGroupFromDto(
    Number(req.params.id),
    requestBody
  );

  if (group === null) {
    res.status(500).send({
      message: "Group not found.",
    });
    return;
  }

  const groupResponseDto = new GroupResponseDto(group);
  await groupResponseDto.loadAssociations(group);

  res.status(200).send({
    message: "Group updated.",
    group: groupResponseDto,
  });
}

export async function getGroups(
  req: GroupSearchRequest,
  res: GroupsResponse
): Promise<void> {
  const requestQuery = req.query;

  const groups = await GroupService.getGroups(requestQuery);

  if (groups === null) {
    res.status(500).send({
      message: "Groups not found.",
    });
    return;
  }

  const groupResponseDtoAssocciationsPromises: Array<Promise<void>> = [];
  const groupResponseDtos = groups.map((group) => {
    const groupReponseDto = new GroupResponseDto(group);
    groupResponseDtoAssocciationsPromises.push(
      groupReponseDto.loadAssociations(group)
    );
    return groupReponseDto;
  });
  await Promise.all(groupResponseDtoAssocciationsPromises);

  res.status(200).send({
    message: "Groups gotten.",
    groups: groupResponseDtos,
  });
}
