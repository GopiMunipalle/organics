import { sequelize } from "../config/dbConfig";

import { Optional, DataTypes, Model } from "sequelize";
import userModel from "./userModel";

export interface payment {
  id: number;
  rzpOrderId: string;
  rzpPaymentId: string;
  amount: number;
  paymentMode: string;
}

export type paymentCreationAttributes = Optional<payment, "id">;
interface imageInstance
  extends Model<payment, paymentCreationAttributes>,
    payment {
  createdAt: Date;
  updatedAt: Date;
}

const paymentModel = sequelize.define<imageInstance>("payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rzpOrderId: {
    type: DataTypes.STRING,
  },
  rzpPaymentId: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.STRING,
  },
  paymentMode: {
    type: DataTypes.STRING,
  },
});

userModel.hasMany(paymentModel, { as: "paymentDetail", foreignKey: "user_id" });
paymentModel.belongsTo(userModel, { as: "user", foreignKey: "user_id" });

export default paymentModel;
