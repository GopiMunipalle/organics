import { Request, Response } from "express";
import languageModel from "../models/languageModel";
import { sendError } from "../middlewares/errorHandler";
import userModel from "../models/userModel";

export async function addLanguage(req: Request, res: Response) {
  try {
    const { language, isDelete } = req.body;
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not exists" });
    }
    if (user.role !== "ADMIN") {
      return sendError(res, 400, {
        error: "You don't have perimission to access this",
      });
    }
    const languageM = await languageModel.findOne({
      where: { language: language },
    });

    if (isDelete) {
      await languageM?.destroy();
      return res
        .status(200)
        .json({ data: { message: "Language deleted successfully" } });
    }

    if (!languageM) {
      const newLanguage = await languageModel.create({ language: language });
      return res
        .status(200)
        .json({
          data: { message: "language Created Successfully", newLanguage },
        });
    }
    return sendError(res, 400, { error: "Language Already Exists" });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function getLanguages(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "user not found" });
    }
    const languages = await languageModel.findAll();
    if (!languages) {
      return sendError(res, 404, { error: "languages not found" });
    }
    return res.status(200).json({ data: languages });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function selectLanguage(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const { languageId } = req.params;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 400, { error: "User not found" });
    }
    const language = await languageModel.findByPk(languageId);
    if (!language) {
      return sendError(res, 404, { error: "Language not found" });
    }
    user.language = language.language;
    await user.save();
    return res
      .status(200)
      .json({ data: { message: "language Changed Successfully" } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}
