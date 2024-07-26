import { NextFunction, Request, Response } from "express";
import { sendError } from "../middlewares/errorHandler";
import { DefaultErrors } from "../utils/constants";
import { errors } from "../middlewares/errorHandler";
import { isAlphaNum, isString } from "../utils/validationUtil";

export function validateAddProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    name,
    productId,
    price,
    quantity,
    condition,
    description,
    skuCode,
    width,
    length,
    height,
    weight,
    categoryId,
  } = req.body;
  const Errors: errors = [];
  if (!name) Errors.push({ error: "name field is empty" });

  if (!price) Errors.push({ error: "price field is empty" });

  if (!quantity) Errors.push({ error: "quantity field is empty" });

  if (!categoryId) Errors.push({ error: "categoryId is empty" });
  if (!productId) Errors.push({ error: "productId field is empty" });
  if (!description) Errors.push({ error: "description is empty" });
  if (!condition) Errors.push({ error: "condition field is empty" });
  if (!isString(name)) Errors.push({ error: "name is not a string" });
  if (!isString(price)) Errors.push({ error: "price is not a string" });
  if (!isString(quantity)) Errors.push({ error: "quantity is not a string" });
  if (!isString(productId)) Errors.push({ error: "productId is not a string" });
  if (!isString(description))
    Errors.push({ error: "description is not a string" });
  if (!isString(condition)) Errors.push({ error: "condition is not a string" });
  if (skuCode && !isString(skuCode))
    Errors.push({ error: "skuCode is not a string" });
  if (width && !isString(width))
    Errors.push({ error: "width is not a string" });
  if (length && !isString(length))
    Errors.push({ error: "length is not a string" });
  if (height && !isString(height))
    Errors.push({ error: "height is not a string" });
  if (weight && !isString(weight))
    Errors.push({ error: "weight is not a string" });
  if (categoryId && !isAlphaNum(categoryId))
    Errors.push({ error: "categoryId is not a valid number" });
  if (Errors.length > 0) {
    return sendError(res, 400, Errors);
  }
  return next();
}
