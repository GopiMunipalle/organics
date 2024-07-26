import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { sendError } from "./errorHandler";
import userModel from "../models/userModel";
const secretKey = process.env.JWTTOKEN;

export async function veriifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return sendError(res, 400, { error: "Please Provide Token" });
    }
    const jwtToken = authHeader.split(" ")[1];
    if (!jwtToken) {
      return sendError(res, 400, { error: "Please Enter Token" });
    }
    jwt.verify(jwtToken, secretKey as string, async (error, payload) => {
      if (error) {
        return sendError(res, 400, { error: "Invalid jwtToken" });
      }
      let id = (payload as JwtPayload).id;
      const user = await userModel.findByPk(id);
      if (!user) {
        return sendError(res, 404, { error: "user not found" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, {
      error: "Internal Server Error At AuthMiddleware",
    });
  }
}

export async function verified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (user.verified === true) {
    return next();
  }
  return sendError(res, 401, { error: "your account is not verified" });
}
