import multer from "multer";
import { Router } from "express";
import {
  allHelpRequests,
  deleteAllUserHelpRequest,
  deleteHelpRequest,
  getAllUserHelpRequests,
  getSingleHelp,
  helpResolved,
  requestHelp,
  updateHelpRequest,
} from "../controllers/helpAndSupportController";
const helpRouter = Router();
const upload = multer();

helpRouter.post("/requestHelp", upload.array("image"), requestHelp);
helpRouter.get("/getAllRequests", getAllUserHelpRequests);
helpRouter.get("/getSingleRequest/:helpId", getSingleHelp);
helpRouter.post("/helpResolved", helpResolved);
helpRouter.get("/allHelps", allHelpRequests);
helpRouter.put("/updateHelp", updateHelpRequest);
helpRouter.delete("/deleteHelpRequest/:helpId", deleteHelpRequest);
helpRouter.delete("/deleteAllHelpRequests", deleteAllUserHelpRequest);

export default helpRouter;
