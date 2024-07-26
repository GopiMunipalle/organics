import { Router } from "express";

import multer from "multer";
import verifyRole from "../middlewares/verifyRole";

import { ADMIN } from "../utils/constants";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
} from "../controllers/categoryController";

const route = Router();

route.post("/", verifyRole([ADMIN]), addCategory);
route.get("/", getAllCategories);
route.put("/:id", verifyRole([ADMIN]), updateCategory);
route.delete("/:id", verifyRole([ADMIN]), deleteCategory);

export default route;
