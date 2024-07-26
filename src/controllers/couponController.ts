import { sendError } from "../middlewares/errorHandler";
import { Request, Response } from "express";
import userModel from "../models/userModel";
import couponModel from "../models/coupanModel";
import { couponCreationAttributes, couponType } from "../models/coupanModel";

export async function createCoupon(req: Request, res: Response) {
  try {
    const {
      couponCode,
      minOrder,
      discountPrice,
      maxPrice,
      discountPercent,
      validTill,
      redemtionLimit,
      description,
    } = req.body;
    let type: couponType = req.body.type;
    const user = await userModel.findOne({ where: { id: req.user.id } });
    const objCreate: couponCreationAttributes = {
      couponCode,
      type,
      validTill,
      redemtionLimit,
      description,
      minOrder,
      maxPrice,
    };
    if (type === "FLAT") {
      objCreate.discountPrice = discountPrice;
    } else if ((type = "PERCENT")) {
      objCreate.discountPercent = discountPercent;
    }
    const coupon = await couponModel.create(objCreate);
    return res.json({ data: { data: coupon.toJSON() } });
  } catch (err) {
    return sendError(res);
  }
}
