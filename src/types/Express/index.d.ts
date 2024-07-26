import { Request } from "express";
import { user } from "../../models/userModel";

interface User extends user {}

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
