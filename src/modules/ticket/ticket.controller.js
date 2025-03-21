const { logger } = require("../../utils/logging.js");
/**
 * TicketController handles ticket-related operations.
 */
const express = require("express");

class TicketController {
  /**
   * @param {Object} ticketService - Service for ticket operations.
   */
  constructor(ticketService) {
    this.ticketService = ticketService;
    this.router = express.Router();
    this.initRoutes();
  }

  /**
   * Initialize ticket-related routes.
   */
  initRoutes() {
    this.router.get("/", this.get.bind(this));
    this.router.get("/:ticket_pkey", this.getTicket.bind(this));
    this.router.post("/", this.postTicket.bind(this));
    this.router.put("/:ticket_pkey", this.putTicket.bind(this));
  }

  /**
   * Get all the current tickets, filtered by user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  async get(req, res) {
    try {
      let tickets;
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "Invalid body" });
      }

      switch (user.role) {
        case "employee":
          tickets = await this.ticketService.read({ owner: user.pkey });
          if (!tickets) {
            return res.status(400).json({ message: "Invalid Tickets" });
          }
          return res.status(200).json({ message: `[${user.pkey}] got Tickets`, tickets: tickets });

        case "manager":
          let statusQuery = req.query.status || 'pending';
          tickets = await this.ticketService.read({ status: statusQuery });
          if (!tickets) {
            return res.status(400).json({ message: "Invalid Tickets" });
          }
          return res.status(200).json({ message: `[${user.pkey}] got Tickets`, tickets: tickets });

        default:
          return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Read request failure" });
    }
  }

  /**
   * Get a specific ticket.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  async getTicket(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "No user found" });
      }
      const ticket_pkey = req.params?.ticket_pkey;
      if (!ticket_pkey) {
        return res.status(400).json({ message: "Invalid Ticket Key" });
      }
      const ticket = await this.ticketService.get({ pkey: ticket_pkey });
      if (!ticket) {
        return res.status(404).json({ message: "No ticket found" });
      }
      if (user.role === "manager" || ticket.owner === user.pkey) {
        return res.status(200).json({ message: `[${user.pkey}] got Ticket`, ticket: ticket });
      }
      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Ticket request failure" });
    }
  }

  /**
   * Update a ticket. Only managers can update tickets.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  async putTicket(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "Invalid User Object" });
      }
      const ticket_pkey = req.params?.ticket_pkey;
      if (!ticket_pkey) {
        return res.status(400).json({ message: "Invalid Ticket" });
      }
      if (user.role === "manager") {
        const payload = req.body;
        if (!payload) {
          return res.status(400).json({ message: "Invalid Object" });
        }
        const updateObjects = payload.updateObjects;
        if (!updateObjects || !(updateObjects instanceof Object)) {
          return res.status(400).json({ message: "Invalid Updates" });
        }
        updateObjects.push({ property: "processor", value: user.pkey });
        const updatedTicket = await this.ticketService.update({ pkey: ticket_pkey }, updateObjects);
        if (!updatedTicket) {
          return res.status(422).json({ message: "Ticket Error" });
        }
        return res.status(200).json({ message: `Ticket:[${updatedTicket.pkey}]; Processed by manager:[${user.pkey}]` });
      }
      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Update request failure" });
    }
  }

  /**
   * Create a ticket.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  async postTicket(req, res) {
    try {
      const data = req.body;
      if (!data) {
        return res.status(400).json({ message: "Invalid Object" });
      }
      const createdTicket = await this.ticketService.create({ ...data, owner: req.user.pkey });
      if (!createdTicket) {
        return res.status(400).json({ message: "Invalid Creation" });
      }
      return res.status(200).json({ message: `[${req.user.pkey}] created Ticket`, pkey: createdTicket.pkey });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Creation request failure" });
    }
  }
}

module.exports = TicketController;
