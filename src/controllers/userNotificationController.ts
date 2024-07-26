import { sendError } from "../middlewares/errorHandler";
import { Request, Response } from "express";
import userModel from "../models/userModel";
import notificationCategoryModel from "../models/notificationCategoryModel";
import {
  userNotificationCreation,
  userNotificationPrefInstance,
} from "../models/userNotificationPrefModel";

export async function getUserNotificationPreferences(
  req: Request,
  res: Response
) {
  try {
    const user = await userModel.findOne({ where: { id: req.user.id } });
    const notificationPrefDetails = await user?.getNotificationPref({
      include: ["type"],
    });
    const notificationCategories = await notificationCategoryModel.findAll({});
    let data: { [key: string]: userNotificationPrefInstance[] } = {};
    notificationCategories.forEach((category) => {
      data[category.name] = [];
      notificationPrefDetails?.forEach((item) => {
        if (category.id === item.category_id) {
          data[category.name].push(item);
        }
      });
    });
    return res.json({
      data: { categories: notificationCategories, dataCategories: data },
    });
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}

export async function toggleNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await userModel.findOne({ where: { id: req.user.id } });
    const notificationPrefArr = await user?.getNotificationPref({
      where: { id: id },
    });
    if (!notificationPrefArr || notificationPrefArr?.length === 0)
      return sendError(res, 400, {
        error: "notficationPref not found for user",
      });
    notificationPrefArr[0].subscribed = status;
    await notificationPrefArr[0].save();
    return res.json({ data: { data: notificationPrefArr[0] } });
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}
