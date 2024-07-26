import { Response } from "express";
import { DefaultErrors } from "../utils/constants";

interface customError {
  error: string;
}

export type errors = customError[];

export type sendErrorResponse =
  | { status: number; errors: errors }
  | { status: number; error: customError };

export function sendError(
  res: Response,
  status: number = 500,
  error: customError | errors | object = { error: DefaultErrors.internalError }
) {
  if (Array.isArray(error)) {
    return res.status(status).json({
      status: status,
      errors: error,
    });
  } else {
    return res.status(status).json({
      status: status,
      error: error,
    });
  }
}
