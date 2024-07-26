import userModel from "../models/userModel";
import { Request, Response } from "express";
import { WhereOptions, Op, where } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transport from "../utils/nodemailer";
import { Resend } from "resend";
import { sendError } from "../middlewares/errorHandler";
import { uploadfiles } from "../utils/cloduinaryUtil";
import { isNumber } from "../utils/validationUtil";
import cartModel from "../models/cartModel";
const resend = new Resend("re_KczmEbBc_F8EKVrvWcPCTmo2rBQSM3yRJ");
import otpModel, { otpAttributes, otpInstance } from "../models/otpModel";
import { feedUserSettings } from "../library/userLibrary";
import { DEFAULT_LANGUAGE } from "../utils/constants";

export async function signUp(req: Request, res: Response) {
  try {
    const { fullName, phNumber, email, password, role } = req.body;
    const defaultLanguage = DEFAULT_LANGUAGE;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await userModel.findOne({
      where: { [Op.or]: [{ email }, { phNumber }] },
    });

    if (!user) {
      const newUser = await userModel.create({
        fullName,
        email,
        phNumber,
        password: hashedPassword,
        role,
        language: defaultLanguage,
      });
      const cartId = await newUser.createCart();
      newUser.cartId = cartId.id;
      await newUser.save();
      await feedUserSettings({ userId: newUser.id });
      return res.status(201).json({
        data: {
          message: "user created Successfully",
          userData: newUser,
        },
      });
    }
    if (user && user.email === email) {
      return sendError(res, 400, {
        error: `User already exists with email: ${email}`,
      });
    }

    if (user && user.phNumber === phNumber) {
      return sendError(res, 400, {
        error: `User already exists with phone number: ${phNumber}`,
      });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    return sendError(res, 500, { error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const secretKey = process.env.JWTTOKEN;
    const { email, number, password } = req.body;

    let user;
    if (email) {
      user = await userModel
        .scope("withPassword")
        .findOne({ where: { email: email } });
    }

    if (number) {
      user = await userModel
        .scope("withPassword")
        .findOne({ where: { phNumber: number } });
    }

    if (!user) {
      return sendError(res, 404, { error: "User not Registered" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return sendError(res, 400, { error: "Incorrect Password" });
    }
    if (!user.verified) {
      return sendError(res, 400, { error: "Your not Verified" });
    }
    const payload = { id: user.id };
    const jwtToken = jwt.sign(payload, secretKey as string, {
      expiresIn: "7d",
    });

    return res.status(200).json({ data: { jwtToken: jwtToken, user: user } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Internal Server Error at Login" });
  }
}

export async function sendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      return sendError(res, 400, { error: "User Not Exists" });
    }

    const userOtp = await otpModel.findOne({ where: { email } });
    const otp = Math.ceil(Math.random() * 100000 + 60000).toString();

    if (!userOtp) {
      const newUserOtp = await otpModel.create({
        email: email,
        otp: otp,
      });
      return res
        .status(200)
        .json({ data: { message: "OTP sent successfully", newUserOtp } });
    }

    const mailOptions = {
      from: process.env.RESENDMAIL,
      to: email,
      subject: "verify your account",
      html: `<p>Your Otp is <strong>${otp}</strong>!</p>`,
    };

    // const dataO = resend.emails.send(mailOptions);
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "munipallegopikrishna@gmail.com",
      subject: "verify your account",
      html: `<p>Your Otp is <strong>${otp}</strong>!</p>`,
    });

    if (error) {
      return sendError(res, 400, { error });
    }

    userOtp.otp = otp;
    await userOtp?.save();

    console.log({ data });

    return res.status(200).json({ data: { message: "OTP sent successfully" } });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, { error: error });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      return sendError(res, 400, { error: "User Not Exists" });
    }

    const userOtp = await otpModel.findOne({
      where: { email: email },
    });

    if (!userOtp) {
      return sendError(res, 400, { error: "OTP Not Found" });
    }

    const currentTime = new Date().getTime();
    const expiresIn = userOtp.createdAt.getTime() + 65 * 1000 * 60;

    if (currentTime > expiresIn) {
      return sendError(res, 400, { error: "OTP expired" });
    }

    const isValid = userOtp.otp === otp;
    if (!isValid) {
      return sendError(res, 400, { error: "Invalid OTP" });
    }

    user.verified = true;
    await user.save();

    return res
      .status(200)
      .json({ data: { message: "OTP verified Successfully" } });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, { error: "Internal Server Error" });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const isValid = newPassword === confirmPassword;
    if (!isValid) {
      return sendError(res, 400, { error: "Confirm password is not matched" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await userModel
      .scope("withPassword")
      .findOne({ where: { email: email } });
    if (!user) {
      return sendError(res, 404, { error: "email not found" });
    }
    const isValidPassword = await bcrypt.compare(newPassword, user.password);
    if (isValidPassword) {
      return sendError(res, 400, { error: "Password Already Updated" });
    }
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ data: { message: "Password changed Successfully" } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: error });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.user.id;
    const user = await userModel.findByPk(id);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return sendError(res, 400, { error: "Incorrect Old Password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ data: { message: "Password Updated Successfully" } });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, { error: "Error at Change Password" });
  }
}

export async function updateUserDetails(req: Request, res: Response) {
  try {
    const id = req.user.id;

    if (id && !isNumber(id)) {
      return sendError(res, 400, { error: "id is not a number" });
    }
    const { name, gender, dateOfBirth, number, email } = req.body;

    const user = await userModel.findByPk(id);
    if (!user) {
      return sendError(res, 404, { error: "User not found" });
    }
    let imageUrl;
    if (Array.isArray(req.files) && req.files.length > 0) {
      const urls = await uploadfiles(req.files);
      imageUrl = urls[0];
    }

    user.fullName = name || user.fullName;
    user.phNumber = number || user.phNumber;
    user.gender = gender || user.gender;
    user.profileUrl = imageUrl || user.profileUrl;
    if (dateOfBirth) {
      const parsedDateOfBirth = new Date(dateOfBirth);
      if (!isNaN(parsedDateOfBirth.getTime())) {
        user.dateOfBirth = parsedDateOfBirth;
      }
    } else {
      user.dateOfBirth = user.dateOfBirth;
    }
    await user.save();

    return res
      .status(200)
      .json({ data: { message: "Profile updated successfully" } });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, { error: error });
  }
}
