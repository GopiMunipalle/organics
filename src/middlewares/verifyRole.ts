import { Request, Response, NextFunction } from "express";
import { role } from "../types/commonTypes";

export default function verifyRole(roles: role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    if (roles.includes(userRole) || userRole === "ADMIN") {
      next();
    } else {
      const error = {
        error: "you do not have permisson to access this source",
      };
      return res.status(500).json(error);
    }
  };
}
