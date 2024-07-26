import { sendError } from "../middlewares/errorHandler";
import { Request, Response } from "express";
import reviewModel from "../models/reviewModel";
import { addAbortListener, promises } from "nodemailer/lib/xoauth2";
import userModel from "../models/userModel";
import productModel from "../models/productModel";

export async function addReview(req: Request, res: Response) {
  try {
    let { ratings, review, productId } = req.body;
    if (ratings < 0) ratings = 0;
    const [product, user] = await Promise.all([
      productModel.findOne({ where: { id: productId } }),
      userModel.findOne({ where: { id: req.user.id } }),
    ]);
    if (product == null) return sendError(res);
    const reviewDoc = await reviewModel.create({ ratings, review });
    reviewDoc.setUser(user);
    reviewDoc.setProduct(product);
    await reviewDoc.save();
    return res.json({
      data: { message: "review added", data: reviewDoc.toJSON() },
    });
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}

export async function getAllReviews(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const product = await productModel.findOne({
      where: { id: Number(productId) },
    });

    if (product === null)
      return sendError(res, 400, { error: "product not found" });
    const Reviews = await product.getReviews({
      offset: (page - 1) * limit,
      limit: limit,
    });
    const totalReviwes = await product.countReviews();
    return res.json({
      data: {
        data: Reviews,
        totalReviwes: totalReviwes,
      },
    });
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}

export async function deleteReivew(req: Request, res: Response) {
  try {
    const { reviewId } = req.params;
    const reviewDoc = await reviewModel.findOne({
      where: { id: Number(reviewId) },
    });
    const reviewer = await reviewDoc?.getUser();
    // if(!reviewer) return
    const user = req.user;
    if (reviewer?.id !== user.id && user.role !== "ADMIN") {
      return sendError(res, 401, { error: "cannot delete the review" });
    }
    await reviewDoc?.destroy();
    return res.json({ data: { message: "review item delted" } });
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}

export async function updateReview(req: Request, res: Response) {
  try {
    const { reviewId } = req.params;
    const reviewDoc = await reviewModel.findOne({
      where: { id: Number(reviewId) },
    });
    if (!reviewDoc) return sendError(res, 400, { error: "review not found" });
    let {
      status = reviewDoc.status,
      review = reviewDoc.review,
      ratings = reviewDoc.ratings,
    } = req.body;
    ratings = ratings < 0 ? 0 : ratings;
    (reviewDoc.ratings = ratings),
      (reviewDoc.review = review),
      (reviewDoc.status = status);
    await reviewDoc.save();

    return res.json({ data: { data: reviewDoc } });
  } catch (err) {
    console.log(err);
    return sendError(res);
  }
}
