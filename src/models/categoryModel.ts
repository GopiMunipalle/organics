import { sequelize } from "../config/dbConfig";
import { Optional, DataTypes, Model } from "sequelize";
import productModel from "./productModel";
import subCategoryModel, { subCategoryInstance } from "./subCategoryModel";

export interface category {
  id: number;
  categoryName: string;
  image: string;
}

export type categroyCreationAttributes = Optional<category, "id" | "image">;
export interface categoryInstance
  extends Model<category, categroyCreationAttributes>,
    category {
  createdAt: Date;
  updatedAt: Date;
  addProduct(param: any): Promise<any>;
  addSubCategory(param: any): Promise<any>;
  getSubCategory(param?: any): Promise<subCategoryInstance[]>;
}

const categoryModel = sequelize.define<categoryInstance>("category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

categoryModel.hasMany(productModel, {
  as: "product",
  foreignKey: "category_id",
});

productModel.belongsTo(categoryModel, {
  as: "category",
  foreignKey: "category_id",
});

categoryModel.hasMany(subCategoryModel, {
  as: "subCategory",
  foreignKey: "category_id",
  onDelete: "CASCADE",
});

export default categoryModel;
