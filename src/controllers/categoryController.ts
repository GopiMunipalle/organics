import { Request, Response } from "express";
import categoryModel, {
  categroyCreationAttributes,
} from "../models/categoryModel";
import { sendError } from "../middlewares/errorHandler";
import { DefaultErrors } from "../utils/constants";
import { uploadfiles } from "../utils/cloduinaryUtil";
export async function addCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const files = req.files;
    let image: string | null = null;
    if (files && Array.isArray(files) && files.length > 0) {
      let images = await uploadfiles(files);
      image = images[0];
    }
    const category = await categoryModel.findOne({
      where: { categoryName: name },
    });
    if (category)
      return sendError(res, 400, { error: "category already exists" });

    const objCreate: categroyCreationAttributes = {
      categoryName: name,
    };
    if (image !== null) {
      objCreate.image = image;
    }
    const categoryDoc = await categoryModel.create(objCreate);
    return res.status(200).json({ data: categoryDoc });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryModel.findOne({
      where: { id: id },
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
    const { id } = req.params;
    const category = await categoryModel.findOne({
      where: { id: id },
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
