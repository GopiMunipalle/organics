import { sequelize } from "../config/dbConfig";

import { Optional, DataTypes, Model } from "sequelize";

type productCondition = "New Product" | "Already Used" | "Pre Order";

export interface notificationCategory {
  id: number;
  name: "Orders" | "Shipping" | "Local Delivery";
}

export type notificationCategoryCreation = notificationCategory;
interface notificationCategoryInstance
  extends Model<notificationCategory, notificationCategoryCreation>,
    notificationCategory {
  createdAt: Date;
  updatedAt: Date;
}

const notificationCategoryModel =
  sequelize.define<notificationCategoryInstance>("notificationCategory", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

export default notificationCategoryModel;
