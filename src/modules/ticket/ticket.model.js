const { v4: uuidv4 } = require('uuid');


const TicketTypes = {
  pkey: "string",
  status: "string",
  type: "string",
  processor: "string",
  amount: "number",
  description: "string",
  owner: "string"
}

/*
  * Model for Ticket objects 
  * @Class Ticket
*/
class Ticket {
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
}
