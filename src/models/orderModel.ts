import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";
import { orderStatus } from "../types/commonTypes";
import paymentModel from "./paymentModel";
import userModel from "./userModel";

export interface orderAttributes {
  id: number;
  addressId: number;
  productId: number;
  discountPrice: number;
  orderStatus: orderStatus;
  // deliveryCharges: number;
  // deliveryStatus: string;
  totalAmount: string;
  paymentMode: string;
}

export type orderCreationAttributes = Optional<orderAttributes, "id">;

export interface orderInstance
  extends Model<orderAttributes, orderCreationAttributes>,
    orderAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const orderModel = sequelize.define<orderInstance>("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  addressId: {
    type: DataTypes.INTEGER,
  },
  productId: {
    type: DataTypes.INTEGER,
  },
  discountPrice: {
    type: DataTypes.INTEGER,
  },
  orderStatus: {
    type: DataTypes.STRING,
  },
  // deliveryCharges: {
  //   type: DataTypes.INTEGER,
  // },
  // deliveryStatus: {
  //   type: DataTypes.STRING,
  // },
  totalAmount: {
    type: DataTypes.STRING,
  },

  paymentMode: {
    type: DataTypes.STRING,
  },
});

orderModel.hasOne(paymentModel, {
  as: "paymentInfo",
  foreignKey: "payment_id",
});
paymentModel.belongsTo(orderModel, {
  as: "orderDetails",
  foreignKey: "payment_id",
});

userModel.hasMany(orderModel, { as: "orders", foreignKey: "user_id" });
orderModel.belongsTo(userModel, { as: "user", foreignKey: "user_id" });

export default orderModel;
