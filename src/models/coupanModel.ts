import { sequelize } from "../config/dbConfig";

import { Optional, DataTypes, Model } from "sequelize";
import userModel from "./userModel";

export type couponType = "FLAT" | "PERCENT";
export interface coupon {
  id: number;
  couponCode: string;
  type: couponType;
  minOrder: number;
  discountPrice: number;
  discountPercent: number;
  validTill: Date;
  redemtionLimit: number;
  description: string;
  maxPrice: number;
}

export type couponCreationAttributes = Optional<
  coupon,
  "id" | "discountPercent" | "discountPrice"
>;
interface couponInstance
  extends Model<coupon, couponCreationAttributes>,
    coupon {
  createdAt: Date;
  updatedAt: Date;
}

const couponModel = sequelize.define<couponInstance>("coupon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  minOrder: {
    type: DataTypes.STRING,
  },
  validTill: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  redemtionLimit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  discountPercent: {
    type: DataTypes.NUMBER,
  },
  discountPrice: {
    type: DataTypes.INTEGER,
  },
  maxPrice: {
    type: DataTypes.INTEGER,
  },
});

userModel.hasMany(couponModel);

export default couponModel;
