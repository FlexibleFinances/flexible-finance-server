import express from "express";

interface paramObject {
  body?: string[];
  query?: string[];
  params?: string[];
}

export function hasRequestParameters(
  req: express.Request,
  res: express.Response,
  requiredParameters: paramObject,
  minOneParameters?: paramObject
): boolean {
  let message = "";
  requiredParameters.body?.forEach((paramName: string) => {
    if (req.body[paramName] === undefined) {
      message = `Missing ${paramName} in request body.`;
    }
  });
  requiredParameters.query?.forEach((paramName: string) => {
    if (req.query[paramName] === undefined) {
      message = `Missing ${paramName} in request query.`;
    }
  });
  requiredParameters.params?.forEach((paramName: string) => {
    if (req.params[paramName] === undefined) {
      message = `Missing ${paramName} in request params.`;
    }
  });
  if (
    minOneParameters?.body?.some((paramName: string) => {
      return req.body[paramName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneParameters.body.join(
      ", "
    )}] in request body.`;
  }
  if (
    minOneParameters?.query?.some((paramName: string) => {
      return req.query[paramName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneParameters.query.join(
      ", "
    )}] in request query.`;
  }
  if (
    minOneParameters?.params?.some((paramName: string) => {
      return req.params[paramName] !== undefined;
    }) === false
  ) {
    message = `Need at least one of [${minOneParameters.params.join(
      ", "
    )}] in request params.`;
  }
  if (message !== "") {
    res.status(400).send({ message: message });
    return false;
  }
  return true;
}
