import { sequelize } from "../config/dbConfig";
import { Optional, DataTypes, Model } from "sequelize";
import productModel from "./productModel";
import userModel, { userInstance } from "./userModel";

export interface review {
  id: number;
  ratings: number;
  review: string;
  status: boolean;
}

export type reviewCreationAttributes = Optional<review, "id" | "status">;
export interface reviewInstance
  extends Model<review, reviewCreationAttributes>,
    review {
  setUser(param: any): Promise<any>;
  setProduct(param: any): Promise<any>;
  getProduct(param?: any): Promise<any>;
  getUser(param?: any): Promise<userInstance>;
  createdAt: Date;
  updatedAt: Date;
}

const reviewModel = sequelize.define<reviewInstance>("review", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ratings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  review: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

userModel.hasMany(reviewModel, { as: "reviews", foreignKey: "user_id" });
productModel.hasMany(reviewModel, { as: "reviews", foreignKey: "product_id" });
reviewModel.belongsTo(userModel, { as: "user", foreignKey: "user_id" });
reviewModel.belongsTo(productModel, {
  as: "product",
  foreignKey: "product_id",
});

export default reviewModel;
