import { Request, Response } from "express";
import { DefaultErrors } from "../utils/constants";
import { sendError } from "../middlewares/errorHandler";
import categoryModel from "../models/categoryModel";
import subCategoryModel from "../models/subCategoryModel";

export async function addSubCategory(req: Request, res: Response) {
  try {
    const user = req.user;
    const { categoryId, name } = req.body;

    const category = await categoryModel.findOne({
      where: { id: Number(categoryId) },
    });
    if (!category) return sendError(res, 404, { error: "category not found" });
    const subCategoryDoc = await category.getSubCategory({ where: { name } });
    if (subCategoryDoc && subCategoryDoc.length > 0) {
      return sendError(res, 400, {
        error: `subCategory ${name} already exist under ${category.categoryName}`,
      });
    }
    const sCategory = await subCategoryModel.create({ name });
    sCategory.category_id = categoryId;
    await sCategory.save();

    return res.json({ data: sCategory });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function updateSubCategory(req: Request, res: Response) {
  try {
    const user = req.user;
    const { name } = req.body;
    const { id } = req.params;
    const subCategory = await subCategoryModel.findOne({
      where: { id: Number(id) },
    });
    if (!subCategory)
      return sendError(res, 404, { error: "subCategory is not found" });
    subCategory.name = name || subCategory.name;
    await subCategory.save();
    return res.json({
      data: { data: subCategory, message: "updated subcategory successfully" },
    });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
export async function removeSubCategory(req: Request, res: Response) {
  try {
    const user = req.user;
    const { name } = req.body;
    const { id } = req.params;
    const subCategory = await subCategoryModel.findOne({
      where: { id: Number(id) },
    });
    if (!subCategory)
      return sendError(res, 404, { error: "subCategory is not found" });
    await subCategory.destroy();
    return res.json({
      data: { message: `removed the subcategory ${subCategory.name}` },
    });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
export async function getSubCategories(req: Request, res: Response) {
  try {
    const user = req.user;
    const subCategoies = await subCategoryModel.findAll({});
    return res.json({ data: subCategoies });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
