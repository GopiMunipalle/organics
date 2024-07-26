import { Router } from "express";
import { veriifyUser } from "../middlewares/authMiddleware";
import verifyRole from "../middlewares/verifyRole";
import {
  addLanguage,
  getLanguages,
  selectLanguage,
} from "../controllers/languageController";
const languageRouter = Router();

languageRouter.post("/addLanguage", verifyRole([]), addLanguage);
languageRouter.get("/getLanguages", getLanguages);
languageRouter.get("/selectLanguage/:languageId", selectLanguage);

export default languageRouter;
