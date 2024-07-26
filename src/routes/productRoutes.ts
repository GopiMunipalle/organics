import { Router } from "express";
import {
  addProduct,
  getSellerProudcts,
  updateProduct,
  getAllProducts,
  getProductDetails,
  deleteProuduct,
  getProductByCategory,
  toggleProduct,
} from "../controllers/productController";
import multer from "multer";
import verifyRole from "../middlewares/verifyRole";
const upload = multer();
import { ADMIN, CUSTOMER, SELLER } from "../utils/constants";

const route = Router();

route.post("/", verifyRole([ADMIN, SELLER]), upload.array("file"), addProduct);
route.put("/:productId");
route.delete("/:productId", verifyRole([ADMIN, SELLER]), deleteProuduct);
route.get("/seller/:id", getSellerProudcts);

route.get("/subCategories", getProductByCategory);
route.get("/:productId", getProductDetails);
route.put("/toggleStatus/", verifyRole([SELLER]), toggleProduct);

export default route;
