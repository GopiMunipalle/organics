import { Router } from "express";
import { veriifyUser } from "../middlewares/authMiddleware";
import {
  addProductToCart,
  getAllCartProducts,
  getSingleCartProduct,
} from "../controllers/cartController";
import { addProductToCartV } from "../validators/cartValidator";
const cartRouter = Router();

cartRouter.post("/addItemsToCart", addProductToCartV, addProductToCart);
cartRouter.get("/getAllProducts/", getAllCartProducts);
cartRouter.get("/getSingleProduct/:productId", getSingleCartProduct);

export default cartRouter;
