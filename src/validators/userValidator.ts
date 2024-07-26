import { NextFunction, Request, Response } from "express";
import { sendError } from "../middlewares/errorHandler";
import { errors } from "../middlewares/errorHandler";
import { validEmail, isString, isNumber } from "../utils/validationUtil";

export function loginValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, number, password } = req.body;

  const phoneRegex = /^\d{10}$/;
  const Error: errors = [];

  if (!email) Error.push({ error: "email field is empty" });

  if (!password) Error.push({ error: "password field is empty" });
  if (email && !isString(email)) {
    Error.push({ error: "email is not a string" });
  }
  if (email && !validEmail(email)) {
    Error.push({ error: "Invalid email format" });
  }
  if (number && !isString(number)) {
    Error.push({ error: "number is not a string" });
  }
  if (number && !phoneRegex.test(number)) {
    Error.push({ error: "Invalid phone number format" });
  }

  if (password && !isString(password)) {
    Error.push({ error: "password is not a string" });
  }
  if (!password || password.length < 4) {
    Error.push({ error: "Please Provide Strong Password" });
  }

  if (Error.length > 0) {
    return sendError(res, 400, Error);
  }
  next();
}

export function signUpValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { fullName, email, phNumber, password, role } = req.body;

  const phoneRegex = /^\d{10}$/;

  const Error: errors = [];

  if (!fullName) Error.push({ error: "Name field is empty" });
  if (!email) Error.push({ error: "Email field is empty" });
  if (!phNumber) Error.push({ error: "Phone number field is empty" });
  if (!password) Error.push({ error: "password field is empty" });
  if (!role) Error.push({ error: "role field is empty" });
  if (!isString(fullName)) Error.push({ error: "name is not a string" });
  if (!isString(email)) Error.push({ error: "email is not a string" });
  if (!isString(phNumber))
    Error.push({ error: "phone number is not a string" });
  if (!isString(password)) Error.push({ error: "password is not a string" });
  if (!isString(role)) Error.push({ error: "role is not a string" });
  if (fullName.trim("").length < 4) {
    Error.push({ error: "Enter Valid Name" });
  }

  if (email && !validEmail(email)) {
    Error.push({ error: "Invalid email format" });
  }

  if (phNumber && !phoneRegex.test(phNumber)) {
    Error.push({ error: "Invalid phone number format" });
  }

  if (password && password.length < 4) {
    Error.push({ error: "Password at least contain 5 letters" });
  }

  if (Error.length > 0) {
    return sendError(res, 400, Error);
  }
  next();
}

export function sendotpV(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;

  if (!email) {
    return sendError(res, 400, { error: "email field is empty" });
  }

  if (email && !isString(email)) {
    return sendError(res, 400, { error: "Invalid email format" });
  }

  if (email && !validEmail(email)) {
    return sendError(res, 400, { error: "Invalid email formate" });
  }
  next();
}

export function verifyOtpV(req: Request, res: Response, next: NextFunction) {
  const { email, otp } = req.body;

  let Error: errors = [];

  if (!email) {
    Error.push({ error: "email field is empty" });
  }

  if (!otp) {
    Error.push({ error: "otp field is empty" });
  }

  if (email && !isString(email)) {
    Error.push({ error: "email is not a string" });
  }

  if (otp && !isString(otp)) Error.push({ error: "otp is not a string" });
  if (email && !validEmail(email)) {
    Error.push({ error: "Invalid email format" });
  }

  if (Error && Error.length > 0) {
    return sendError(res, 400, Error);
  }

  next();
}

export function forgetPassV(req: Request, res: Response, next: NextFunction) {
  const { email, newPassword, confirmPassword } = req.body;

  const Errors: errors = [];

  if (!email) Errors.push({ error: "email field is empty" });
  if (!newPassword) Errors.push({ error: "new Password field is empty" });
  if (!confirmPassword)
    Errors.push({ error: "confirm password field is empty" });

  if (email && !isString(email))
    Errors.push({ error: "email is not a string" });
  if (newPassword && !isString(newPassword))
    Errors.push({ error: "new password is not a string" });
  if (confirmPassword && !isString(confirmPassword)) {
    Errors.push({ error: "confirm password is not a string" });
  }
  if (email && !validEmail(email)) {
    Errors.push({ error: "Invalid email format" });
  }

  if (Errors.length > 0) {
    return sendError(res, 400, Errors);
  }
  next();
}

export function changePassV(req: Request, res: Response, next: NextFunction) {
  const { newPassword, oldPassword } = req.body;
  const id = req.user.id;

  const Errors: errors = [];
  if (id && !isNumber(id)) {
    Errors.push({ error: "id is not a number" });
  }
  if (!newPassword) {
    Errors.push({ error: "Please Provide new Password" });
  }
  if (!oldPassword) {
    Errors.push({ error: "Please Provide old Password" });
  }

  if (newPassword && !isString(newPassword)) {
    Errors.push({ error: "new password is not a string" });
  }

  if (oldPassword && !isString(oldPassword)) {
    Errors.push({ error: "old password is not a string" });
  }

  if (Errors.length > 0) {
    return sendError(res, 400, Errors);
  }
  next();
}
