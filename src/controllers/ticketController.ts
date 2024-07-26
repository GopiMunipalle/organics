import { json } from "sequelize";
import { sendError } from "../middlewares/errorHandler";
import ticketModel from "../models/ticketModel";
import userModel from "../models/userModel";
import { DefaultErrors } from "../utils/constants";
import { Request, Response } from "express";

export async function addTicket(req: Request, res: Response) {
  try {
    const { userName, description, type } = req.body;
    const user = await userModel.findOne({ where: { id: req.user.id } });
    const ticket = await ticketModel.create({
      description,
      type,
      name: user?.fullName,
      resolved: false,
    });
    console.log(ticket);
    await ticket.setRaisedUser(user);
    return res.json({ data: { message: "created ticket", data: ticket } });
  } catch (err) {
    console.log(err);

    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function getTicketDetails(req: Request, res: Response) {
  try {
    const { ticketId } = req.params;
    const ticket = await ticketModel.findOne({
      where: { id: Number(ticketId) },
      include: ["raisedUser"],
    });
    if (ticket === null)
      return sendError(res, 400, { error: "ticket not found" });
    return res.json({ data: ticket.toJSON() });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function removeTicket(req: Request, res: Response) {
  try {
    const { ticketId } = req.params;
    const ticket = await ticketModel.findOne({
      where: { id: Number(ticketId) },
    });
    if (ticket === null)
      return sendError(res, 400, { error: "ticket not found" });
    const raisedUser = await ticket.getRaisedUser();
    let hasPermissionToRemove = false;
    if (req.user.role === "ADMIN" || raisedUser.id === req.user.id)
      hasPermissionToRemove = true;
    if (!hasPermissionToRemove)
      return sendError(res, 401, {
        error: "you do not have permission to delete this item",
      });
    if (ticket.resolved === true && req.user.role !== "ADMIN") {
      return sendError(res, 400, { error: "ticket is resolved cannot delete" });
    }
    await ticket.destroy();
    return res.json({ data: "ticket deleted succesfully" });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function resolveTicket(req: Request, res: Response) {
  try {
    const { ticketId } = req.params;
    const { comment } = req.body;
    const user = await userModel.findOne({ where: { id: req.user.id } });
    const ticket = await ticketModel.findOne({
      where: { id: Number(ticketId) },
    });
    if (!ticket || ticket === null)
      return sendError(res, 400, { error: "ticket not found" });
    if (ticket.resolved === true)
      return res.json({ data: { message: "ticket already resolved" } });
    ticket.comment = comment;
    ticket.resolved = true;
    await ticket.setResolvedUser(user);

    await ticket.save();

    // notification
    // send notification to user
    return res.json({
      data: { message: `resolved ticket ${ticket.id}`, data: ticket.toJSON() },
    });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}

export async function getAllTickets(req: Request, res: Response) {
  try {
    const { resolved } = req.query;

    let resolvedTickets = false;
    if (resolved === "true") {
      resolvedTickets = true;
    }

    const tickets = await ticketModel.findAll({
      where: { resolved: resolvedTickets },
      include: ["raisedUser", "resolvedUser"],
    });

    return res.json({ data: tickets });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, { error: DefaultErrors.internalError });
  }
}
