import { Request, Response } from "express";
import userModel from "../models/userModel";
import notificationTypeModel from "../models/notificationTypesModel";
import notificationCategoryModel from "../models/notificationCategoryModel";
import { sendError } from "../middlewares/errorHandler";

export async function addNotificationType(req: Request, res: Response) {
  try {
    const user = await userModel.findOne({ where: { id: req.user.id } });
    const { name, categoryId, description, role } = req.body;
    const notficationCategory = await notificationCategoryModel.findOne({
      where: { id: Number(categoryId) },
    });
    const notificationType = await notificationTypeModel.create({
      name,
      description,
      role,
    });
    await notificationType.setCategory(notficationCategory);
    return res.json({
      data: { message: "notification type created", data: notificationType },
    });
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}
