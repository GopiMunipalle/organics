import notificationTypeModel from "../models/notificationTypesModel";
import notificationCategoryModel from "../models/notificationCategoryModel";
import userModel, { userInstance } from "../models/userModel";
import userNotificationPrefModel, {
  userNotificatonPref,
} from "../models/userNotificationPrefModel";

interface feedUserSettings {
  userId: number;
}

export async function feedUserSettings(data: feedUserSettings) {
  try {
    const user = await userModel.findOne({ where: { id: data.userId } });
    if (user?.role === "SELLER") {
      await addSellerNotificationSetting({ user });
    }
  } catch (err) {
    console.log(err);
  } finally {
    Promise.resolve();
  }
}

interface sellerNotificationParams {
  user: userInstance;
}

async function addSellerNotificationSetting(param: sellerNotificationParams) {
  try {
    const notificationTypes = await notificationTypeModel.findAll();
    const notificationCategories = await notificationCategoryModel.findAll();
    for (const type of notificationTypes) {
      const category = notificationCategories.find(
        (item) => item.id === type.categoryId
      );
      const categoryName = category?.name;
      const notificationPref = await userNotificationPrefModel.create({
        notificationCategory: categoryName,
        notificationType: type.name,
        subscribed: true,
      });
      await notificationPref.setUser(param.user);
      await notificationPref.setCategory(category);
      await notificationPref.setType(type);
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}
