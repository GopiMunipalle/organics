import { fcm } from "../config/firebaseConfig";

export type notificationType = {
  image?: string;
  title: string | undefined;
  body: string | undefined;
};

export async function sendFcmNotification(
  fcmToken: string,
  notification: notificationType
) {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        img: notification.image,
      },
      token: fcmToken,
    };
    const resp = await fcm.send(message);
    return Promise.resolve({ resp });
  } catch (err) {
    return Promise.reject({ err });
  }
}
