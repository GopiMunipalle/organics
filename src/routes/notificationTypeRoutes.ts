import { Router } from "express";

import multer from "multer";
import verifyRole from "../middlewares/verifyRole";

import { ADMIN } from "../utils/constants";
import { addNotificationType } from "../controllers/notificationTypeController";

const route = Router();

route.post("/", verifyRole([ADMIN]), addNotificationType);

export default route;
