import {
  productCondition,
  productCreationAttributes,
} from "../models/productModel";
import productModel from "../models/productModel";
import { Request, Response } from "express";

import { sendError } from "../middlewares/errorHandler";
import userModel from "../models/userModel";
import { DefaultErrors } from "../utils/constants";
import { imageUrlCreationAttributes } from "../models/imageModel";
import { uploadfiles } from "../utils/cloduinaryUtil";
import categoryModel from "../models/categoryModel";
import subCategoryModel, {
  product_subcategories,
  product_subcategoriesModel,
} from "../models/subCategoryModel";
import { sequelize } from "../config/dbConfig";
import businessModel from "../models/businessModel";

export async function getAllProducts(req: Request, res: Response) {
  try {
    const user = req.user;
    const userDoc = await userModel.findOne({ where: { id: user.id } });
    const products = userDoc?.getProducts();
    console.log(products);
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function getSellerProudcts(req: Request, res: Response) {
  try {
    let { id } = req.params;
    let sellerId: number;
    if (typeof id !== undefined) {
      sellerId = Number(id);
    } else if (req.user.role === "SELLER") {
      sellerId = req.user.id;
    } else {
      return sendError(res, 400, { error: "provide seller id" });
    }
    const seller = await userModel.findOne({ where: { id: sellerId } });
    if (seller === null) {
      return sendError(res, 404, { error: "seller not found" });
    }
    const products = await seller.getProducts({
      include: ["images", "category"],
    });
    return res.status(200).json({ data: products });
  } catch (err) {
    return sendError(res, 500, { error: "Internal server error" });
  }
}

export async function addProduct(req: Request, res: Response) {
  try {
    const payload = req.body;
    const user = await userModel.findOne({ where: { id: req.user.id } });

    let imageUrls: string[] = [];
    const sellerBusiness = await user?.getBusiness();
    if (!sellerBusiness)
      return sendError(res, 400, {
        error: "seller has no business , cannot add product",
      });

    let images: imageUrlCreationAttributes[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imageUrls = await uploadfiles(req.files);
      imageUrls.forEach((url) => {
        images.push({ url: url });
      });
    }
    const categoryId = payload.categoryId;
    // get the valid sub categories

    const category = await categoryModel.findOne({
      where: { id: Number(categoryId) },
    });
    if (!category) return sendError(res, 400, { error: "category not found" });

    let objCreate: productCreationAttributes = {
      name: payload.name,
      productId: payload.productId as string,
      price: Number(payload.price),
      quantity: Number(payload.quantity),
      condition: payload.condition as productCondition,
      description: payload.description as string,
      skuCode: payload.skuCode,
      images: images,
    };

    if (payload.width) {
      objCreate.width = payload.width;
    }
    if (payload.length) {
      objCreate.length = payload.length;
    }
    if (payload.height) {
      objCreate.height = payload.height;
    }
    if (payload.weight) {
      objCreate.weight = payload.weight;
    }
    const product = await productModel.create(
      { ...objCreate },
      { include: "images" }
    );
    const subCategoryIds = payload.subCategoryIds;
    const subCategoryObPromises = subCategoryIds.map((item: any) => {
      return subCategoryModel.findOne({
        where: { id: Number(item) },
      });
    });

    const subCategoryOb = await Promise.all(subCategoryObPromises);
    const filteredSubCategoryOb = subCategoryOb.filter((item) => item !== null);

    await product_subcategoriesModel.bulkCreate(
      filteredSubCategoryOb.map((item) => {
        return {
          product_id: product.id,
          subcategory_id: Number(item.id),
        };
      })
    );
    await Promise.all([
      user?.addProducts(product),
      category.addProduct(product),
      product.setBusiness(sellerBusiness),
    ]);
    const updatedProduct = await productModel.findByPk(product.id, {
      include: "images",
    });
    return res.status(200).json({ data: updatedProduct });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function deleteProuduct(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    const user = req.user;
    const product = await productModel.findByPk(Number(productId));
    if (!product) return sendError(res, 404, { error: "product not found" });
    const productOwner = await product.getOwner();
    if (user.role === "SELLER" && productOwner.id !== user.id) {
      return sendError(res, 401, {
        error: "you do not have access to delete this product",
      });
    }
    await product.destroy();
    return res
      .status(200)
      .json({ data: { message: "product delted successfully" } });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function getProductDetails(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    console.log("started here ---------------->>>>>>>>>>>>>>>>>>>>...");

    const product = await productModel.findOne({
      where: { id: Number(productId) },
      include: [
        {
          model: subCategoryModel,
          as: "subCategory",
          attributes: ["id", "name", "category_id"],
        },
        "images",
        "category",
      ],
    });

    if (!product) return sendError(res, 404, { error: "product not found" });
    const subCategories = await product_subcategoriesModel.findAll({
      where: { product_id: product.id },
    });
    return res.json({
      data: { product: product },
    });
  } catch (err) {
    console.log(err);

    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function getProductByCategory(req: Request, res: Response) {
  try {
    const { categoryId, subCategoryId } = req.query;

    let subCategoryIds = [];
    if (Array.isArray(subCategoryId)) {
      subCategoryIds = subCategoryId.map((id) => Number(id));
    } else {
      subCategoryIds = [Number(subCategoryId)];
    }

    let productIds: any[] = await product_subcategoriesModel.findAll({
      where: { subcategory_id: subCategoryIds },
      attributes: ["productId"],
    });
    productIds = productIds.map((items) => {
      return items.productId;
    });
    const products = await productModel.findAll({
      where: { id: productIds },
      include: ["images", "category"],
    });

    return res.json({ data: products });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function toggleProduct(req: Request, res: Response) {
  try {
    const { status, productId } = req.body;
    const product = await productModel.findOne({
      where: { id: Number(productId) },
    });
    if (!product) return sendError(res);
    if (status === true) product.isActive = true;
    else if (status === false) product.isActive = false;
    await product.save();
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
