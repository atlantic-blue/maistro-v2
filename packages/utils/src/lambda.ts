import type { APIGatewayProxyResultV2 } from "aws-lambda";
import type { ApiError } from "@maistro/types";
import { HTTP_STATUS, ERROR_CODES } from "@maistro/types";

export interface LambdaResponse {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
};

export function success<T>(data: T, statusCode: number = HTTP_STATUS.OK): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify({ success: true, data }),
  };
}

export function created<T>(data: T): APIGatewayProxyResultV2 {
  return success(data, HTTP_STATUS.CREATED);
}

export function noContent(): APIGatewayProxyResultV2 {
  return {
    statusCode: HTTP_STATUS.NO_CONTENT,
    headers: defaultHeaders,
    body: "",
  };
}

export function error(
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): APIGatewayProxyResultV2 {
  const apiError: ApiError = { code, message, ...(details ? { details } : {}) };
  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify({ success: false, error: apiError }),
  };
}

export function badRequest(message: string, details?: Record<string, unknown>): APIGatewayProxyResultV2 {
  return error(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, message, details);
}

export function unauthorized(message = "Unauthorized"): APIGatewayProxyResultV2 {
  return error(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, message);
}

export function forbidden(message = "Forbidden"): APIGatewayProxyResultV2 {
  return error(HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, message);
}

export function notFound(message = "Resource not found"): APIGatewayProxyResultV2 {
  return error(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, message);
}

export function conflict(message: string): APIGatewayProxyResultV2 {
  return error(HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, message);
}

export function rateLimited(message = "Too many requests"): APIGatewayProxyResultV2 {
  return error(HTTP_STATUS.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMITED, message);
}

export function internalError(message = "Internal server error"): APIGatewayProxyResultV2 {
  return error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR, message);
}

export function parseBody<T>(body: string | null | undefined): T | null {
  if (!body) return null;
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

export function getUserId(event: any): string | null {
  return (
    event.requestContext?.authorizer?.jwt?.claims?.sub ??
    event.requestContext?.authorizer?.claims?.sub ??
    null
  );
}
