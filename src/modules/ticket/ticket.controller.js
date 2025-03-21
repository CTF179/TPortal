const express = require("express");

class TicketController {
  constructor(ticketService) {
    this.ticketService = ticketService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.get.bind(this));
    this.router.get("/:ticket_pkey", this.getTicket.bind(this));
    this.router.post("/", this.postTicket.bind(this));
    this.router.put("/:ticket_pkey", this.putTicket.bind(this));
  }

  /*
    * Get all the current tickets.
    * Filtered by user
    *
    * */
  // TODO: Add a query parameter to filter by status, type [,...property]
  // TODO: Add a way to filter 
  // TODO: make async in preparation
  async get(req, res) {
    try {
      let tickets;
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "Invalid body" })
      }

      switch (user.role) {
        case "employee":
          tickets = await this.ticketService.read({ owner: user.pkey });
          if (!tickets) {
            return res.status(400).json({ message: "Invalid Tickets" })
          }

          return res.status(200).json({ message: `[${user.pkey}] got Tickets`, tickets: tickets });

        case "manager":
          let statusQuery = req.query.status;
          if (!statusQuery) {
            statusQuery = 'pending'
          }
          tickets = await this.ticketService.read({ status: statusQuery });
          if (!tickets) {
            return res.status(400).json({ message: "Invalid Tickets" })
          }

          return res.status(200).json({ message: `[${user.pkey}] got Tickets`, tickets: tickets });

        default:
          return res.status(401).json({ message: "Unathorized" });
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Read request failure" });
    }
  }

  /*
    * Get a specific ticket.
    * Owner can view their tickets; While manager can view every ticket
    * */
  async getTicket(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "No found" });
      }

      const ticket_pkey = req.params?.ticket_pkey
      if (!ticket_pkey) {
        return res.status(400).json({ message: "Invalid Ticket Key" });
      }

      const ticket = await this.ticketService.get({ pkey: ticket_pkey });
      if (!ticket) {
        return res.status(404).json({ message: "No ticket found" });
      }

      switch (user.role) {
        case "manager":
          return res.status(200).json({ message: `[${user.pkey}] got Ticket`, ticket: ticket });

        case "employee":
          if (ticket.owner != user.pkey) {
            return res.status(401).json({ message: "Unathorized: Owner Invalid" });
          }
          return res.status(200).json({ message: `${user.pkey} got Ticket`, ticket: ticket });

        default:
          return res.status(404).json({ message: "Not Found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Ticket request failure" });
    }
  }

  /*
    * Update values in ticket.
    * Admin can update any ticket attribute.
    * */
  async putTicket(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "Invalid User Object" });
      }

      const ticket_pkey = req.params?.ticket_pkey
      if (!ticket_pkey) {
        return res.status(400).json({ message: "Invalid Ticket" });
      }

      switch (user.role) {
        case "manager":
          const payload = req.body;
          if (!payload) {
            return res.status(400).json({ message: "Invalid Object" });
          }

          const updateObjects = payload.updateObjects;
          if (!updateObjects || !(updateObjects instanceof Object)) {
            return res.status(400).json({ message: "Invalid Updates" });
          }
          updateObjects.push({ property: "processor", value: user.pkey });

          const updatedTicket = await this.ticketService.update({ pkey: ticket_pkey }, payload.updateObjects)
          if (!updatedTicket) {
            return res.status(422).json({ message: "Ticket Error" })
          }

          return res.status(200).json({ message: `Ticket:[${updatedTicket.pkey}]; Processed by manager:[${user.pkey}]` });

        default:
          return res.status(401).json({ message: "Unathorized" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Update request failure" });
    }
  }

  /*
    * Create a ticket.
    * Admin can update any ticket attribute.
    * */
  async postTicket(req, res) {
    try {
      const data = req.body;
      if (!data) {
        return res.status(400).json({ message: "Invalid Object" })
      }

      const createdTicket = await this.ticketService.create({ ...data, owner: req.user.pkey });
      if (!createdTicket) {
        return res.status(400).json({ message: "Invalid Creation" })
      }

      return res.status(200).json({ message: `[${req.user.pkey}] created Ticket`, pkey: createdTicket.pkey })
    } catch (error) {
      return res.status(500).json({ message: "Creation request failure" });

    }
  }


}

module.exports = TicketController;
