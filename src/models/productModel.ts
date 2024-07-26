import { sequelize } from "../config/dbConfig";
import {
  Optional,
  ModelDefined,
  DataTypes,
  DATE,
  Model,
  Deferrable,
} from "sequelize";
import userModel, { userInstance } from "./userModel";

import { ALREADYUSED, NEWPRODUCT, PREORDER } from "../utils/constants";
import imageModel, { imageUrlCreationAttributes, imageUrl } from "./imageModel";
import subCategoryModel from "./subCategoryModel";
import businessModel from "./businessModel";

export type productCondition = "New Product" | "Already Used" | "Pre Order";

export interface product {
  id: number;
  name: string;
  productId: string;
  price: number;
  quantity: number;
  condition: productCondition;
  description: string;
  skuCode: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  mainImage: string;
  isActive: boolean;
}

export type productCreationAttributes = Optional<
  product,
  "id" | "width" | "height" | "length" | "weight" | "mainImage" | "isActive"
> & { images: imageUrlCreationAttributes[] };
export interface productInstance
  extends Model<product, productCreationAttributes>,
    product {
  createdAt: Date;
  updatedAt: Date;
  images: imageUrl[];
  createImages(params: imageUrlCreationAttributes): Promise<any>;
  setCategory(param: any): Promise<any>;
  getOwner(): Promise<userInstance>;
  getSubCategory(param?: any): Promise<any>;
  getBusiness(params?: any): Promise<any>;
  setBusiness(params?: any): Promise<any>;
  getReviews(params?: any): Promise<any>;
  addReviews(params: any): Promise<any>;
  countReviews(): Promise<any>;
}

const productModel = sequelize.define<productInstance>("product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.STRING,
    unique: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 0,
  },
  condition: {
    type: DataTypes.ENUM(ALREADYUSED, PREORDER, NEWPRODUCT),
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skuCode: {
    type: DataTypes.STRING,
  },
  weight: {
    type: DataTypes.STRING,
  },
  width: {
    type: DataTypes.STRING,
  },
  height: {
    type: DataTypes.STRING,
  },
  length: {
    type: DataTypes.STRING,
  },
  mainImage: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

productModel.hasMany(imageModel, {
  as: "images",
  foreignKey: "product_id",
  sourceKey: "id",
});

productModel.belongsTo(businessModel, {
  as: "business",
  foreignKey: "business_id",
});

export default productModel;
