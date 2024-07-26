import { Router } from "express";
import verifyRole from "../middlewares/verifyRole";
import {
  addNewAddress,
  deleteAddress,
  getAllAddresses,
  updateAddress,
} from "../controllers/addressController";
import { addAddressV, updateAndDeleteV } from "../validators/addressValidator";
const addressRouter = Router();

addressRouter.post("/addAddress", addAddressV, addNewAddress);
addressRouter.get("/getAllAddresses", getAllAddresses);
addressRouter.delete("/delete/:addressId", updateAndDeleteV, deleteAddress);
addressRouter.put("/update/:addressId", updateAndDeleteV, updateAddress);

export default addressRouter;
