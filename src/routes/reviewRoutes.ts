import { Router } from "express";
import {
  addReview,
  getAllReviews,
  updateReview,
  deleteReivew,
} from "../controllers/reviewController";
import { ADMIN, SELLER } from "../utils/constants";

const route = Router();

route.post("/", addReview);
route.get("/:productId", getAllReviews);
route.put("/:reviewId", updateReview);
route.delete("/:reviewId", deleteReivew);

export default route;
