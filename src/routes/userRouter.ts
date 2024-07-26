import {
  signUp,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  updateUserDetails,
} from "../controllers/userController";

import {
  signUpValidator,
  loginValidator,
  sendotpV,
  verifyOtpV,
  forgetPassV,
  changePassV,
} from "../validators/userValidator";

import multer from "multer";
import { veriifyUser } from "../middlewares/authMiddleware";
import { Router } from "express";
const upload = multer();
const userRouter = Router();

userRouter.post("/signUp", signUpValidator, signUp);
userRouter.post("/login", loginValidator, login);
userRouter.post("/sendOtp", sendotpV, sendOtp);
userRouter.post("/verifyOtp", verifyOtpV, verifyOtp);
userRouter.post("/forgot", forgetPassV, forgotPassword);
userRouter.post("/changePassword", changePassV, veriifyUser, updateUserDetails);
userRouter.put(
  "/update",
  veriifyUser,
  upload.array("image"),
  updateUserDetails
);

export default userRouter;
