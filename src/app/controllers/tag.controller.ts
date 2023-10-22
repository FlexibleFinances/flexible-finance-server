import {
  type TagRequest,
  type TagResponse,
  TagResponseDto,
  type TagSearchRequest,
  type TagsResponse,
} from "../apiDtos/TagDtos";
import {
  createTagFromDto,
  getTagById,
  getTagsByOptions,
  updateTagFromDto,
} from "../repositories/TagRepository";
import { hasRequestArguments } from "../../utils/helperFunctions";

export async function getTag(req: TagRequest, res: TagResponse): Promise<void> {
  const tag = await getTagById(Number(req.params.tagId));

  if (tag === null) {
    res.status(500).send({
      message: "Tag not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Tag gotten.",
    tag: new TagResponseDto(tag),
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

  const tag = await createTagFromDto(requestBody);

  if (tag === null) {
    res.status(500).send({
      message: "Tag not created.",
    });
    return;
  }

  res.status(200).send({
    message: "Tag created.",
    tag: new TagResponseDto(tag),
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

  if (
    !hasRequestArguments(req, res, { params: ["TagId"] }, { body: ["name"] })
  ) {
    return;
  }

  const tag = await updateTagFromDto(requestBody);

  if (tag === null) {
    res.status(500).send({
      message: "Tag not found.",
    });
    return;
  }

  res.status(200).send({
    message: "Tag updated.",
    tag: new TagResponseDto(tag),
  });
}

export async function getTags(
  req: TagSearchRequest,
  res: TagsResponse
): Promise<void> {
  const requestQuery = req.query;

  const tags = await getTagsByOptions(requestQuery);

  if (tags === null) {
    res.status(500).send({
      message: "Tags not found.",
    });
    return;
  }

  const tagDtos = tags.map((tag) => new TagResponseDto(tag));

  if (req.query.isTemplate as unknown as boolean) {
    res.status(200).send({
      message: "Tag Templates gotten.",
      templates: tagDtos,
    });
  } else {
    res.status(200).send({
      message: "Tags gotten.",
      tags: tagDtos,
    });
  }
}
