import { Router } from "express";

import verifyRole from "../middlewares/verifyRole";

import { ADMIN } from "../utils/constants";
import {
  addSubCategory,
  removeSubCategory,
  getSubCategories,
  updateSubCategory,
} from "../controllers/subCategoryController";

const route = Router();

route.post("/", verifyRole([ADMIN]), addSubCategory);
route.get("/", getSubCategories);
route.put("/:id", verifyRole([ADMIN]), updateSubCategory);
route.delete("/:id", verifyRole([ADMIN]), removeSubCategory);

export default route;
