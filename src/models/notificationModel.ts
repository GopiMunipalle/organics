import { sequelize } from "../config/dbConfig";

import { Optional, DataTypes, Model } from "sequelize";
import userModel, { userInstance } from "./userModel";

export interface notification {
  id: number;
  title: string;
  event: "ORDER" | "OFFER" | "PROMOTION";
  content: string;
  read: boolean;
}

export type notificationCreationAttributes = Optional<notification, "id">;
export interface notificationInstance
  extends Model<notification, notificationCreationAttributes>,
    notification {
  user_id: number;
  getReciever(param?: any): Promise<userInstance>;
  setReciever(param: any): Promise<any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationModel = sequelize.define<notificationInstance>(
  "notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event: {
      type: DataTypes.ENUM("ORDER", "OFFER", "PROMOTION"),
    },
    content: {
      type: DataTypes.TEXT,
    },
    read: {
      type: DataTypes.BOOLEAN,
    },
  }
);

export default notificationModel;
