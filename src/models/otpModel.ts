import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

export interface otpAttributes {
  id: number;
  otp: string;
  email: string;
}

export type otpCreationAttributes = Optional<otpAttributes, "id">;

export interface otpInstance
  extends Model<otpAttributes, otpCreationAttributes>,
    otpAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const otpModel = sequelize.define<otpInstance>("otp", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  otp: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
});

export default otpModel;
