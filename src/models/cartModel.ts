import { DataTypes, Model, Optional, useInflection } from "sequelize";
import { sequelize } from "../config/dbConfig";
import { productCreationAttributes, productInstance } from "./productModel";
import productModel from "../models/productModel";
import userModel from "./userModel";

export interface cartAttributes {
  id: number;
}

export interface cartProductAttributes {
  id: number;
  productId: number;
  cartId: number;
  quantity: number;
  // cartTotal: string;
}

export type cartCreationAttributes = Optional<cartAttributes, "id">;

export type cartProductCreationAttributes = Optional<
  cartProductAttributes,
  "id"
>;

export interface cartInstance
  extends Model<cartAttributes, cartCreationAttributes>,
    cartAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export interface cartProductInstance
  extends Model<cartProductAttributes, cartProductCreationAttributes>,
    cartProductAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const cartModel = sequelize.define<cartInstance>("Cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

export const cartProductModel = sequelize.define<cartProductInstance>(
  "CartProduct",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    cartId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
      references: { model: productModel, key: "id" },
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  }
);

// cartModel.hasMany(cartProductModel, {
//   as: "Cart",
//   foreignKey: "cart_id",
// });
cartProductModel.belongsTo(productModel);

export default cartModel;
