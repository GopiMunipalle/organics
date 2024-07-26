import { Request, Response } from "express";
import userModel from "../models/userModel";
import { sendError } from "../middlewares/errorHandler";
import addressModel from "../models/addressModel";
import { Op } from "sequelize";

export async function addNewAddress(req: Request, res: Response) {
  try {
    const {
      street,
      landmark,
      city,
      district,
      state,
      country,
      latitude,
      longitude,
      pincode,
    } = req.body;
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    const address = await user.createAddress({
      street,
      landmark,
      city,
      district,
      state,
      country,
      latitude,
      longitude,
      pincode,
    });
    if (!address) {
      return sendError(res, 400, { error: "Address Not Created" });
    }
    return res.status(201).send({ data: { address: address } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, {
      error: "Internal Server Error",
      errors: error,
    });
  }
}

export async function getAllAddresses(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    const allAddresses = await user.getAddress();
    if (!allAddresses) {
      return sendError(res, 400, {
        error: "No address are added, Please Add a new address",
      });
    }
    return res.status(200).json({ data: { address: allAddresses } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function deleteAddress(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const addressId = req.params.addressId;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    const address = await addressModel.findByPk(addressId);
    if (!address) {
      return sendError(res, 404, { error: "address not found" });
    }
    await address.destroy();
    return res
      .status(200)
      .json({ data: { message: "Address Deleted Successfully" } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function updateAddress(req: Request, res: Response) {
  try {
    const { addressId } = req.params;
    const {
      street,
      landmark,
      city,
      district,
      state,
      country,
      latitude,
      longitude,
      pincode,
    } = req.body;
    const userId = req.user.id;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "user not found" });
    }
    const address = await addressModel.findByPk(addressId);
    if (!address) {
      return sendError(res, 404, { error: "Address not found" });
    }

    address.street = street || address.street;
    address.landmark = landmark || address.landmark;
    address.city = city || address.city;
    address.district = district || address.district;
    address.state = state || address.state;
    address.country = country || address.country;
    address.latitude = latitude || address.latitude;
    address.longitude = longitude || address.longitude;
    address.pincode = pincode || address.pincode;
    await address.save();
    return res
      .status(200)
      .send({ data: { message: "Address Updated Successfully" } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}
