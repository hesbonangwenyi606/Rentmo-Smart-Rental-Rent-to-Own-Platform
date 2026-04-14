import { Response } from "express";

export function success<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function created<T>(res: Response, data: T, message = "Created") {
  return success(res, data, message, 201);
}

export function paginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = "Success"
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export function error(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown
) {
  return res
    .status(statusCode)
    .json({ success: false, message, ...(errors ? { errors } : {}) });
}

export function notFound(res: Response, resource = "Resource") {
  return error(res, `${resource} not found`, 404);
}

export function unauthorized(res: Response, message = "Unauthorized") {
  return error(res, message, 401);
}

export function forbidden(res: Response, message = "Forbidden") {
  return error(res, message, 403);
}
