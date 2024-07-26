import { sendError } from "../middlewares/errorHandler";
import userModel from "../models/userModel";
import userNotificationPrefModel from "../models/userNotificationPrefModel";
import notificationModel from "../models/notificationModel";
import { sendFcmNotification } from "./fcmLib";

interface sendNotificationParams {
  user_id: number;
  event: string;
  type: "ORDER" | "PROMOTION" | "OFFER";
  seller_id?: number;
  title: string;
  content: string;
}

// get the user id
// get the event
// get the seller

export async function sendNotification(param: sendNotificationParams) {
  try {
    const user = await userModel.findOne({ where: { id: param.user_id } });
    const notificationPrefs = await user?.getNotificationPref({
      where: { notificationType: param.event },
    });
    if (notificationPrefs && notificationPrefs.length === 0) {
      console.log(`user has no notification preference`);
      return;
    }
    if (notificationPrefs && notificationPrefs[0].subscribed === false)
      return Promise.resolve();

    const notification = await notificationModel.create({
      title: param.title,
      content: param.content,
      read: false,
      event: param.type,
    });
    await notification.setReciever(user);
    if (user?.fcmToken) {
      //call push notification
      sendFcmNotification(user.fcmToken, {
        title: param.title,
        body: param.content,
      });
    }
    return Promise.resolve();
  } catch (err) {
    console.log(err);
    return Promise.resolve();
  }
}
