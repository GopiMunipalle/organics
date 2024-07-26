import { sendError } from "../middlewares/errorHandler";
import helpAndSupportModel, {
  helpAndSupportInstance,
} from "../models/helpAndSupportModel";
import { Request, Response } from "express";
import { uploadfiles } from "../utils/cloduinaryUtil";
import userModel from "../models/userModel";
import { WhereOptions } from "sequelize";
import { HELP_OPEN, HELP_RESOLVED } from "../utils/constants";
import imageModel from "../models/imageModel";

export async function requestHelp(req: Request, res: Response) {
  try {
    const helpReqStatus = HELP_OPEN;
    const { title, description } = req.body;
    let imageUrls;

    if (Array.isArray(req.files) && req.files.length > 0) {
      const urls = await uploadfiles(req.files);
      imageUrls = urls;
    }

    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "user not found" });
    }
    const help = await user.createHelp({
      title,
      description,
      status: helpReqStatus,
    });
    if (imageUrls && imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        await help.createImage({ url: imageUrl });
      }
    }
    return res.status(200).json({ data: { message: help } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function getAllUserHelpRequests(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "user not found" });
    }
    const getRequests = await user.getHelp({
      include: { model: imageModel, as: "images" },
    });
    if (!getRequests) {
      return sendError(res, 400, { error: "No Requests Found" });
    }
    return res.status(200).json({ data: { helps: getRequests } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function getSingleHelp(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const { helpId } = req.params;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    const singleHelpReq = await helpAndSupportModel.findOne({
      where: {
        id: helpId,
        user_id: userId,
      } as WhereOptions<helpAndSupportInstance>,
      include: { model: imageModel, as: "images" },
    });
    return res.status(200).json({ data: { helps: singleHelpReq } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function helpResolved(req: Request, res: Response) {
  try {
    const resolved_status = HELP_RESOLVED;
    const userId = req.user.id;
    const { helpId, comment } = req.body;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    if (user.role !== "ADMIN" || !user.verified) {
      return sendError(res, 400, {
        error: "Your not an admin or not verified",
      });
    }
    const help = await helpAndSupportModel.findOne({
      where: { id: helpId },
      include: { model: imageModel, as: "images" },
    });
    if (!help) {
      return sendError(res, 404, { error: "help Request not found" });
    }
    help.set({ comment: comment });
    help.status = resolved_status as string;
    await help.save();
    return res.status(200).json({ data: { message: help } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function allHelpRequests(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    if (user.role !== "ADMIN" || !user.verified) {
      return sendError(res, 400, {
        error: "Your not an admin or not verified",
      });
    }
    const helpRequests = await helpAndSupportModel.findAndCountAll({
      include: { model: imageModel, as: "images" },
    });
    if (!helpRequests) {
      return sendError(res, 400, { error: "help Requests not found" });
    }
    return res.status(200).json({ data: { message: helpRequests } });
  } catch (error) {
    console.log(error);
    return sendError(res, 400, { error: "Internal Server Error" });
  }
}

export async function updateHelpRequest(req: Request, res: Response) {
  try {
    const { helpId, title, description, imageIdToDelete } = req.body;
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    const helpRequest = await helpAndSupportModel.findOne({
      where: { id: helpId },
      include: { model: imageModel, as: "images" },
    });
    if (!helpRequest) {
      return sendError(res, 404, { error: "Help Request not found" });
    }

    helpRequest.title = title || helpRequest.title;
    helpRequest.description = description || helpRequest.description;
    await helpRequest.save();

    if (imageIdToDelete) {
      const image = await imageModel.findByPk(imageIdToDelete);
      if (!image) {
        return sendError(res, 404, { error: "Image not found" });
      }
      await image.destroy();
    }

    return res.status(200).json({
      data: { message: "Help request updated successfully", helpRequest },
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function deleteHelpRequest(req: Request, res: Response) {
  try {
    const { helpId } = req.params;
    const userId = req.user.id;

    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }

    const helpRequest = await helpAndSupportModel.findOne({
      where: { id: helpId },
      include: { model: imageModel, as: "images" },
    });
    if (!helpRequest) {
      return sendError(res, 404, { error: "Help Request not found" });
    }

    await helpRequest.destroy();

    return res.status(200).json({
      data: {
        message: "Help request and associated images deleted successfully",
      },
    });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function deleteAllUserHelpRequest(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 400, { error: "User not found" });
    }
    const helpRequests = await helpAndSupportModel.findAll({
      where: { user_id: userId } as WhereOptions<helpAndSupportInstance>,
      include: { model: imageModel, as: "images" },
    });

    await Promise.all(helpRequests.map((item) => item.destroy()));
    return res
      .status(200)
      .json({ data: { message: "Deleted All Help Requests", helpRequests } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}
