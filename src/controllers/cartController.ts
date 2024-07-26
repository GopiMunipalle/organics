import { Op } from "sequelize";
import { sendError } from "../middlewares/errorHandler";
import cartModel, { cartProductModel } from "../models/cartModel";
import userModel from "../models/userModel";
import { Request, Response } from "express";
import productModel from "../models/productModel";

export async function addProductToCart(req: Request, res: Response) {
  try {
    const { productId, isAdded } = req.body;
    const userId = req.user.id;
    const product_Id = Number(productId);
    const cartId = req.user.cartId;

    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }

    const cart = await cartProductModel.findOne({
      where: { cartId: cartId, productId },
    });
    if (!isAdded) {
      await cart?.destroy();
      return res
        .status(200)
        .json({ data: "product successfully removed from cart" });
    }
    if (!cart) {
      const newCart = await cartProductModel.create({
        cartId: cartId,
        productId: product_Id,
        quantity: 1,
      });

      return res.status(201).json({
        data: { message: "Product Added To Cart Successfully", newCart },
      });
    }
    if (req.query.action == "increase") {
      cart.quantity += 1;
      await cart.save();
      return res.status(200).json({ data: { cart } });
    } else if (req.query.action == "decrease") {
      if (cart.quantity > 1) {
        cart.quantity -= 1;
        await cart.save();
        return res.status(200).json({ data: { cart } });
      } else {
        await cart?.destroy();
        await cart.save();
        return res
          .status(200)
          .json({ data: "product successfully removed from cart" });
      }
    }
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function getAllCartProducts(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const cartId = req.user.cartId;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 400, { error: "User not found" });
    }
    const products = await cartProductModel.findAll({
      where: { cartId },
      include: productModel,
    });
    if (products.length == 0) {
      return sendError(res, 400, { error: "Cart has no items" });
    }

    return res.status(200).json({
      data: { items: products },
    });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function getSingleCartProduct(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const product_Id = Number(productId);
    const cartId = req.user.cartId;

    const user = await userModel.findByPk(userId);
    if (!user) {
      return sendError(res, 400, { error: "User not found" });
    }
    const product = await cartProductModel.findOne({
      where: { cartId: cartId, productId: product_Id },
      include: productModel,
    });
    if (!product) {
      return sendError(res, 404, { error: "Product not exist" });
    }
    return res.status(200).json({ data: { product } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}
