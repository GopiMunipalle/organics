import { Router } from "express";
import {
  addBusinessAddress,
  createBusiness,
  getBusinessDetails,
} from "../controllers/businessController";
import verifyRole from "../middlewares/verifyRole";
import { ADMIN, SELLER } from "../utils/constants";

const route = Router();

route.post("/", verifyRole([ADMIN, SELLER]), createBusiness);
route.get("/:businessId", verifyRole([SELLER]), getBusinessDetails);
route.post("/address", verifyRole([SELLER]), addBusinessAddress);
export default route;
