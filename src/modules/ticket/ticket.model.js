const { v4: uuidv4 } = require('uuid');

/**
 * @typedef {Object} TicketTypes
 * @property {string} pkey - Unique identifier for the ticket.
 * @property {string} status - Current status of the ticket.
 * @property {string} type - Type of the ticket (e.g., reimbursement).
 * @property {string} processor - User processing the ticket.
 * @property {number} amount - Amount associated with the ticket.
 * @property {string} description - Description of the ticket.
 * @property {string} owner - Owner of the ticket.
 */
const TicketTypes = {
  pkey: "string",
  status: "string",
  type: "string",
  processor: "string",
  amount: "number",
  description: "string",
  owner: "string"
};

/**
 * Represents a Ticket object.
 */
class Ticket {
  /**
   * Creates a new Ticket instance.
   * @param {Object} options - Ticket properties.
   * @param {string} [options.pkey=uuidv4()] - Unique identifier for the ticket.
   * @param {string} [options.status="pending"] - Current status of the ticket.
   * @param {string} [options.type="reimbursement"] - Type of the ticket.
   * @param {string|null} [options.processor=null] - Processor of the ticket.
   * @param {number} options.amount - Amount associated with the ticket.
   * @param {string} options.description - Description of the ticket.
   * @param {string} options.owner - Owner of the ticket.
   */
  constructor({
    pkey = uuidv4(),
    status = "pending",
    type = "reimbursement",
    processor = null,
    amount,
    description,
    owner
  } = {}) {
    this.pkey = pkey;
    this.status = status;
    this.type = type;
    this.processor = processor;
    this.amount = amount;
    this.description = description;
    this.owner = owner;
  }
}

module.exports = {
  Ticket,
  TicketTypes
};

