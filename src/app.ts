import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
const app = express();
import { veriifyUser } from "./middlewares/authMiddleware";
import path from "path";
import languageModel from "./models/languageModel";
app.use(express.json());

import userRouter from "./routes/userRouter";
import categoryRoutes from "./routes/categoryRoutes";
import subCategoryRoutes from "./routes/subCategoryRoutes";
import addressRouter from "./routes/addressRoutes";
import businessRoutes from "./routes/businessRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import productRoutes from "./routes/productRoutes";
import languageRouter from "./routes/languageRoutes";
import helpRouter from "./routes/helpAndSupportRouter";
import notificationTypeRoutes from "./routes/notificationTypeRoutes";
import userNotificationRoutes from "./routes/userNotificationRoutes";
import cartRouter from "./routes/cartRoutes";

app.use(logRequests);
app.use(express.json());
// routes
app.use("/user", userRouter);
app.use("/cart", veriifyUser, cartRouter);
app.use("/products", veriifyUser, productRoutes);
app.use("/categories", veriifyUser, categoryRoutes);
app.use("/subCategory", veriifyUser, subCategoryRoutes);
app.use("/address", veriifyUser, addressRouter);
app.use("/business", veriifyUser, businessRoutes);
app.use("/tickets", veriifyUser, ticketRoutes);
app.use("/reviews", veriifyUser, reviewRoutes);
app.use("/languages", veriifyUser, languageRouter);
app.use("/helpAndSupport", veriifyUser, helpRouter);
app.use("/notificationType", veriifyUser, notificationTypeRoutes);
app.use("/userNotifications", veriifyUser, userNotificationRoutes);

app.use("/", (req: Request, res: Response) => {
  return res.status(404).sendFile(path.join(__dirname + "/utils/404page.html"));
});

export default app;

function logRequests(req: Request, res: Response, next: NextFunction) {
  console.log(
    "\x1b[36m%s\x1b[0m",
    req.url,
    "\x1b[38;5;46m",
    "method : ",
    req.method
  );
  next();
}
