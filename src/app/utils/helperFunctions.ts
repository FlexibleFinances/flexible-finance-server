import express from "express";

interface paramObject {
  body?: string[];
  query?: string[];
  params?: string[];
}

export function hasRequestParameters(
  req: express.Request,
  res: express.Response,
  requiredParameters: paramObject
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
    if (req.query[paramName] === undefined) {
      message = `Missing ${paramName} in request params.`;
    }
  });
  if (message !== "") {
    res.status(400).send({ message: message });
    return false;
  }
  return true;
}
