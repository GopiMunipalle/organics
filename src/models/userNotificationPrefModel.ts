import { sequelize } from "../config/dbConfig";

import { Optional, DataTypes, Model } from "sequelize";
import notificationTypeModel from "./notificationTypesModel";
import notificationCategoryModel from "./notificationCategoryModel";
import userModel from "./userModel";

export interface userNotificatonPref {
  id: number;
  notificationCategory: string;
  notificationType: string;
  subscribed: boolean;
}
export type userNotificationCreation = Optional<
  userNotificatonPref,
  "id" | "notificationCategory" | "notificationType" | "subscribed"
>;
export interface userNotificationPrefInstance
  extends Model<userNotificatonPref, userNotificationCreation>,
    userNotificatonPref {
  category_id: number;
  user_id: number;
  setUser(param: any): Promise<any>;
  getUser(param?: any): Promise<any>;
  setCategory(param: any): Promise<any>;
  getCategory(param?: any): Promise<any>;
  setType(param: any): Promise<any>;
  getType(param?: any): Promise<any>;
  createdAt: Date;
  updatedAt: Date;
}

const userNotificationPrefModel =
  sequelize.define<userNotificationPrefInstance>("userNotificationPref", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    notificationCategory: {
      type: DataTypes.STRING,
    },
    notificationType: {
      type: DataTypes.STRING,
    },
    subscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

userModel.hasMany(userNotificationPrefModel, {
  foreignKey: "user_id",
  as: "notificationPref",
});
userNotificationPrefModel.belongsTo(userModel, {
  foreignKey: "user_id",
  as: "user",
});

userNotificationPrefModel.belongsTo(notificationCategoryModel, {
  foreignKey: "category_id",
  as: "category",
  onDelete: "CASCADE",
});
userNotificationPrefModel.belongsTo(notificationTypeModel, {
  foreignKey: "notificationtype_id",
  as: "type",
  onDelete: "CASCADE",
});

export default userNotificationPrefModel;
