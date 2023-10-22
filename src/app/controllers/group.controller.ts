import {
  type GroupRequest,
  type GroupResponse,
  GroupResponseDto,
  type GroupSearchRequest,
  type GroupsResponse,
} from "../apiDtos/GroupDtos";
import {
  createGroupFromDto,
  getGroupById,
  getGroupsByOptions,
  updateGroupFromDto,
} from "../repositories/GroupRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getGroup(
  req: GroupRequest,
  res: GroupResponse
): Promise<void> {
  const group = await getGroupById(Number(req.params.groupId));

  if (group === null) {
    res.status(500).send({
      message: "Group not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Group gotten.",
    group: new GroupResponseDto(group),
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

  const group = await createGroupFromDto(requestBody);

  if (group === null) {
    res.status(500).send({
      message: "Group not created.",
    });
    return;
  }

  res.status(200).send({
    message: "Group created.",
    group: new GroupResponseDto(group),
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
      { params: ["GroupId"] },
      { body: ["name", "GroupId"] }
    )
  ) {
    return;
  }

  const group = await updateGroupFromDto(requestBody);

  if (group === null) {
    res.status(500).send({
      message: "Group not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Group updated.",
    group: new GroupResponseDto(group),
  });
}

export async function getGroups(
  req: GroupSearchRequest,
  res: GroupsResponse
): Promise<void> {
  const requestQuery = req.query;

  const groups = await getGroupsByOptions(requestQuery);

  if (groups === null) {
    res.status(500).send({
      message: "Groups not found.",
    });
    return;
  }

  const groupDtos = groups.map((group) => new GroupResponseDto(group));

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Group Templates gotten.",
      templates: groupDtos,
    });
  } else {
    res.status(200).send({
      message: "Groups gotten.",
      groups: groupDtos,
    });
  }
}
