import { Router } from "express";

import verifyRole from "../middlewares/verifyRole";

import { ADMIN, CUSTOMER, SELLER } from "../utils/constants";
import {
  addTicket,
  getAllTickets,
  getTicketDetails,
  removeTicket,
  resolveTicket,
} from "../controllers/ticketController";
const route = Router();

route.post("/", verifyRole([CUSTOMER]), addTicket);
route.get("/allTickets", getAllTickets);
route.get("/:ticketId", getTicketDetails);
route.put("/:ticketId", verifyRole([CUSTOMER]), addTicket);
route.delete("/:ticketId", verifyRole([CUSTOMER]), removeTicket);
route.post("/resolve/:ticketId", verifyRole([SELLER]), resolveTicket);

export default route;
