import { NextFunction, Request, Response } from "express";
import { sendError } from "../middlewares/errorHandler";
import { errors } from "../middlewares/errorHandler";
import { isNumber, isString } from "../utils/validationUtil";

export function addAddressV(req: Request, res: Response, next: NextFunction) {
  const {
    street,
    landmark,
    city,
    district,
    state,
    country,
    latitude,
    longitude,
    pincode,
  } = req.body;
  let Errors: errors = [];

  if (!street) Errors.push({ error: "Street field is empty" });
  if (!landmark) Errors.push({ error: "landmark field is empty" });
  if (!city) Errors.push({ error: "city field is empty" });
  if (!district) Errors.push({ error: "distric field is empty" });
  if (!state) Errors.push({ error: "state field is empty" });
  if (!country) Errors.push({ error: "country field is empty" });
  if (!pincode) Errors.push({ error: "pincode is empty" });

  if (street && !isString(street)) {
    Errors.push({ error: "street field is not a string" });
  }
  if (landmark && !isString(landmark)) {
    Errors.push({ error: "landmark field is not a string" });
  }
  if (city && !isString(city)) {
    Errors.push({ error: "city field is not a string" });
  }
  if (district && !isString(district)) {
    Errors.push({ error: "district field is not a string" });
  }
  if (state && !isString(state)) {
    Errors.push({ error: "district field is not a string" });
  }
  if (country && !isString(country)) {
    Errors.push({ error: "country field is not a string" });
  }
  if (pincode && !isString(pincode)) {
    Errors.push({ error: "pincode field is not a string" });
  }

  if (Errors && Errors.length > 0) {
    return sendError(res, 400, Errors);
  }
  next();
}

export function updateAndDeleteV(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const addressId = req.params.addressId;

  if (addressId && !isNumber(addressId)) {
    return sendError(res, 400, { error: "address id field is not a number" });
  }
  next();
}
