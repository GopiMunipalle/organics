import { sequelize } from "../config/dbConfig";
import { Optional, DataTypes, Model } from "sequelize";
import productModel from "./productModel";

export interface subCategory {
  id: number;
  name: string;
}

export type subCategoryCreationAttributes = Optional<subCategory, "id">;
export interface subCategoryInstance
  extends Model<subCategory, subCategoryCreationAttributes>,
    subCategory {
  category_id: number;
  createdAt: Date;
  updatedAt: Date;
}

const subCategoryModel = sequelize.define<subCategoryInstance>("subcategory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export interface product_subcategories {
  product_id: number;
  subcategory_id: number;
}

export interface product_subcategoriesInstance
  extends Model<product_subcategories>,
    product_subcategories {
  createdAt: Date;
  updatedAt: Date;
}
export const product_subcategoriesModel =
  sequelize.define<product_subcategoriesInstance>("product_subcategories", {
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: productModel,
      },
      allowNull: false,
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      references: {
        model: subCategoryModel,
      },
      allowNull: false,
    },
  });

productModel.belongsToMany(subCategoryModel, {
  as: "subCategory",
  foreignKey: "subcategory_id",
  through: product_subcategoriesModel,
});
subCategoryModel.belongsToMany(productModel, {
  as: "product",
  foreignKey: "product_id",
  through: product_subcategoriesModel,
});

export default subCategoryModel;
