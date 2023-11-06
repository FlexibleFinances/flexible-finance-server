import * as TagService from "../services/TagService";
import {
  type TagRequest,
  type TagResponse,
  TagResponseDto,
  type TagSearchRequest,
  type TagsResponse,
} from "../apiDtos/TagDtos";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getTag(req: TagRequest, res: TagResponse): Promise<void> {
  const tag = await TagService.getTag(Number(req.params.id));

  if (tag === null) {
    res.status(500).send({
      message: "Tag not found.",
    });
    return;
  }

  const tagResponseDto = new TagResponseDto(tag);

  res.status(200).send({
    message: "Tag gotten.",
    tag: tagResponseDto,
  });
}

export async function createTag(
  req: TagRequest,
  res: TagResponse
): Promise<void> {
  const requestBody = req.body;
  if (requestBody === undefined) {
    res.status(500).send({
      message: "Request not valid.",
    });
    return;
  }

  const tag = await TagService.createTagFromDto(requestBody);

  if (tag === null) {
    res.status(500).send({
      message: "Tag not created.",
    });
    return;
  }

  const tagResponseDto = new TagResponseDto(tag);

  res.status(200).send({
    message: "Tag created.",
    tag: tagResponseDto,
  });
}

export async function updateTag(
  req: TagRequest,
  res: TagResponse
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

  const tag = await TagService.updateTagFromDto(
    Number(req.params.id),
    requestBody
  );

  if (tag === null) {
    res.status(500).send({
      message: "Tag not found.",
    });
    return;
  }

  const tagResponseDto = new TagResponseDto(tag);

  res.status(200).send({
    message: "Tag updated.",
    tag: tagResponseDto,
  });
}

export async function getTags(
  req: TagSearchRequest,
  res: TagsResponse
): Promise<void> {
  const requestQuery = req.query;

  const tags = await TagService.getTags(requestQuery);

  if (tags === null) {
    res.status(500).send({
      message: "Tags not found.",
    });
    return;
  }

  const tagResponseDtos = tags.map((tag) => {
    const tagReponseDto = new TagResponseDto(tag);
    return tagReponseDto;
  });

  res.status(200).send({
    message: "Tags gotten.",
    tags: tagResponseDtos,
  });
}
