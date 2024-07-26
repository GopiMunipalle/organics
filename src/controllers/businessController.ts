import { sendError } from "../middlewares/errorHandler";
import { DefaultErrors } from "../utils/constants";
import { Request, Response } from "express";
import businessModel, { businessInstance } from "../models/businessModel";
import addressModel from "../models/addressModel";
import userModel, { userInstance } from "../models/userModel";
import { json } from "sequelize";

export async function createBusiness(req: Request, res: Response) {
  try {
    const {
      gstNumber,
      shopName,
      addressLine1,
      addressLine2,
      landmark,
      phNumber,
      pincode,
      city,
      state,
      accountNumber,
      accountHolderName,
      ifseCode,
      accountType,
      sellerId,
    } = req.body;
    const user = await userModel.findOne({ where: { id: req.user.id } });
    let seller: userInstance | null = null;
    if (!user) return sendError(res, 400, { error: "user not found" });
    if (sellerId && sellerId != undefined && user?.role !== "ADMIN") {
    }
    const addressObj = {
      addressLine1,
      addressLine2,
      landmark,
      pincode,
      city,
      state,
      street: addressLine1 || addressLine2,
      country: "INDIA",
    };
    const businessObj = {
      gstNumber,
      shopName,
      phNumber,
      accountType,
      accountNumber,
      accountHolderName,
      ifseCode,
    };
    const addressDoc = await addressModel.create(addressObj);
    let business: businessInstance | null = null;
    try {
      business = await businessModel.create(businessObj);
    } catch (err) {
      addressDoc.destroy();
      throw err;
    }
    await business.addAddress(addressDoc);

    await user.setBusiness(business);
    const updatedBusiness = await businessModel.findOne({
      where: { id: business.id },
    });
    return res.json({
      data: { message: "business created", data: updatedBusiness },
    });
  } catch (err) {
    console.log(err);

    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
export async function getBusinessDetails(req: Request, res: Response) {
  try {
    const { businessId } = req.params;
    const businessDetails = await businessModel.findOne({
      where: { id: Number(businessId) },
      include: ["address"],
    });
    if (!businessDetails)
      return sendError(res, 404, { error: "business details not found" });
    return res.json({ data: businessDetails });
  } catch (err) {
    console.log(err);

    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
export async function updateBusinessDetails(req: Request, res: Response) {
  try {
  } catch (err) {
    console.log(err);

    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function addBusinessAddress(req: Request, res: Response) {
  try {
    const payload = {
      ...req.body,
      street: req.body.street || "",
      country: "INDIA",
    };

    const user = await userModel.findOne({ where: { id: req.user.id } });
    const userBusiness = await user?.getBusiness();
    if (!userBusiness)
      return sendError(res, 400, { error: "seller has no business" });
    const address = await addressModel.create(payload);
    await userBusiness.addAddress(address);
    const businessDetails = await businessModel.findOne({
      where: { id: userBusiness.id },
      include: ["address"],
    });
    return res.json({
      data: { message: "added address", data: businessDetails },
    });
  } catch (err) {
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
