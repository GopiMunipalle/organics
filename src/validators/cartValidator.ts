import { NextFunction, Request, Response } from "express";
import { errors, sendError } from "../middlewares/errorHandler";

export function addProductToCartV(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let Errors: errors = [];
  const { productId, isAdded } = req.body;
  if (!productId) Errors.push({ error: "product id field is empty" });
  if (!isAdded) Errors.push({ error: "isAdded field if empty" });
  if (typeof isAdded !== "boolean") {
    Errors.push({ error: "isAdded field Required a boolean value" });
  }
  if (Errors.length > 0) {
    return sendError(res, 400, { errors: Errors });
  }
  next();
}
