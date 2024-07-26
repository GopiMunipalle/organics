import { sequelize } from "../config/dbConfig";

import { Optional, DataTypes, Model } from "sequelize";
import notificationCategoryModel from "./notificationCategoryModel";
import { role } from "../types/commonTypes";

export interface notificationTypes {
  id: number;
  name: string;
  description: string;
  role: role;
}

export type notificationTypesCreationAttributes = Optional<
  notificationTypes,
  "id"
>;
interface notificationTypesInstance
  extends Model<notificationTypes, notificationTypesCreationAttributes>,
    notificationTypes {
  categoryId: number;
  setCategory(param: any): Promise<any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationTypeModel = sequelize.define<notificationTypesInstance>(
  "notificationTypes",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
    },
  }
);

notificationTypeModel.belongsTo(notificationCategoryModel, {
  foreignKey: "categoryId",
  as: "category",
});
notificationCategoryModel.hasMany(notificationTypeModel, {
  as: "subCategories",
  foreignKey: "categoryId",
});

export default notificationTypeModel;
