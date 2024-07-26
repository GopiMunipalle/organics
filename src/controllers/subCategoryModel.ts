import { Request, Response } from "express";
import categoryModel from "../models/categoryModel";
import { sendError } from "../middlewares/errorHandler";
import { DefaultErrors } from "../utils/constants";
export async function addCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const category = await categoryModel.findOne({
      where: { categoryName: name },
    });
    if (category)
      return sendError(res, 400, { error: "category already exists" });
    const categoryDoc = await categoryModel.create({ categoryName: name });
    return res.status(200).json({ data: categoryDoc });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const category = await categoryModel.findOne({
      where: { categoryName: name },
    });
    if (!category) return sendError(res, 400, { error: "category not found" });
    category.categoryName = name;
    await category.save();
    return res
      .status(200)
      .json({ data: { message: "updated category successfully" } });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const category = await categoryModel.findOne({
      where: { categoryName: name },
    });
    if (!category) return sendError(res, 400, { error: "category not found" });
    await category.destroy();
    return res.status(200).json({ data: { message: "Deleted category" } });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await categoryModel.findAll();
    return res.status(200).json({ data: categories });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
