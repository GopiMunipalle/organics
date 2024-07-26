import { Router } from "express";

import {
  getUserNotificationPreferences,
  toggleNotification,
} from "../controllers/userNotificationController";

import {
  deleteNotification,
  getNotifications,
  getNotificatonDetails,
  updateNotification,
} from "../controllers/notificationController";

const route = Router();

route.get("/preferences", getUserNotificationPreferences);
route.put("/toggle/:id", toggleNotification);
route.get("/:id", getNotificatonDetails);
route.put("/:id", updateNotification);
route.delete("/:id", deleteNotification);
route.get("/", getNotifications);

export default route;
