import { sendError } from "../middlewares/errorHandler";
import { Request, Response } from "express";
import userModel from "../models/userModel";
import notificationModel from "../models/notificationModel";

export async function getNotifications(req: Request, res: Response) {
  try {
    const user = await userModel.findOne({ where: { id: req.user.id } });
    const notifications = await user?.getNotifications({
      order: [["createdAt", "DESC"]],
    });
    return res.json({ data: { data: notifications } });
  } catch (err) {
    return sendError(res);
  }
}

export async function getNotificatonDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const notification = await notificationModel.findOne({
      where: { id: Number(id) },
      include: ["reciever"],
    });
    if (!notification)
      return res.json({ data: { data: "notification not  found" } });
    return res.json({ data: { data: notification } });
  } catch (err) {
    return sendError(res);
  }
}

// read notification
export async function updateNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const notification = await notificationModel.findOne({ where: { id: id } });
    if (!notification) return sendError(res);
    notification.read = status;
    await notification.save();
    return res.json({ data: { message: "ok" } });
  } catch (err) {
    return sendError(res);
  }
}

// delte notification
export async function deleteNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({ where: { id: req.user.id } });
    if (!user) return sendError(res, 400, { error: "user not found" });
    const notification = await notificationModel.findOne({ where: { id: id } });
    if (!notification)
      return sendError(res, 400, { error: "notification not found" });
    const reciever = await notification.getReciever();
    if (reciever.id !== user.id || user.role !== "ADMIN")
      return sendError(res, 401, { error: "cannot delte notification" });
    await reciever.destroy();
    return res.json({ data: { message: "notification deleted successfully" } });
  } catch (err) {
    return sendError(res);
  }
}
