const { isValidUUID, isValidStatus, isValidDescription, isValidAmount, isValidTicketUpdate } = require("../../utils/validator.js");

/**
 * Service class for managing ticket-related operations.
 */
class TicketService {
  /**
   * Creates a TicketService instance.
   * @param {Object} ticketRepository - The repository instance for ticket operations.
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * Verifies the input ticket lookup is valid and retrieves the ticket.
   * @param {Object} unverifiedLookupObject - The object to lookup the ticket.
   * @param {string} unverifiedLookupObject.pkey - The unique identifier of the ticket.
   * @returns {Promise<Ticket | undefined>} A promise that resolves to a ticket or undefined if invalid.
   */
  async get(unverifiedLookupObject) {
    if (!unverifiedLookupObject?.pkey || !isValidUUID(unverifiedLookupObject.pkey)) {
      return undefined;
    }
    return await this.ticketRepository.get(unverifiedLookupObject);
  };

  /**
   * Verifies the input ticket lookup is valid and retrieves a list of tickets.
   * @param {Object} unverifiedLookupObject - The object to lookup tickets.
   * @param {string} [unverifiedLookupObject.owner] - The owner’s unique identifier.
   * @param {string} [unverifiedLookupObject.status] - The status of the ticket.
   * @returns {Promise<Array<Ticket> | undefined>} A promise that resolves to an array of tickets or undefined if invalid.
   */
  async read(unverifiedLookupObject) {
    if (!(unverifiedLookupObject?.owner || unverifiedLookupObject?.status)) {
      return undefined;
    }

    if (unverifiedLookupObject?.owner && !isValidUUID(unverifiedLookupObject.owner)) {
      return undefined;
    }

    if (unverifiedLookupObject?.status && !isValidStatus(unverifiedLookupObject.status)) {
      return undefined;
    }

    return await this.ticketRepository.read(unverifiedLookupObject);
  };

  /**
   * Verifies the input ticket object is valid and creates a ticket.
   * @param {Object} unverifiedTicketObject - The ticket object to be created.
   * @param {string} unverifiedTicketObject.owner - The owner’s unique identifier.
   * @param {string} unverifiedTicketObject.description - The description of the ticket.
   * @param {number} unverifiedTicketObject.amount - The amount associated with the ticket.
   * @returns {Promise<Ticket | undefined>} A promise that resolves to the created ticket or undefined if invalid.
   */
  async create(unverifiedTicketObject) {
    if (!unverifiedTicketObject?.owner || !isValidUUID(unverifiedTicketObject.owner)) {
      return undefined;
    }

    if (!unverifiedTicketObject?.description || !isValidDescription(unverifiedTicketObject.description)) {
      return undefined;
    }

    if (!unverifiedTicketObject?.amount || !isValidAmount(unverifiedTicketObject.amount)) {
      return undefined;
    }

    return await this.ticketRepository.create(unverifiedTicketObject);
  };

  /**
   * Verifies the input for updating a ticket and updates it.
   * @param {Object} unverifiedLookupObject - The object to lookup the ticket.
   * @param {string} unverifiedLookupObject.pkey - The unique identifier of the ticket.
   * @param {Array<Object>} unverifiedUpdateObject - The list of properties and their new values to update.
   * @returns {Promise<Ticket | undefined>} A promise that resolves to the updated ticket or undefined if invalid.
   */
  async update(unverifiedLookupObject, unverifiedUpdateObject) {
    if (!unverifiedLookupObject?.pkey || !isValidUUID(unverifiedLookupObject.pkey)) {
      return undefined;
    }

    if (!isValidTicketUpdate(unverifiedUpdateObject)) {
      return undefined;
    }

    const ticket = await this.ticketRepository.get({ pkey: unverifiedLookupObject.pkey });
    if (!ticket || ticket.processor != null) {
      return undefined;
    }
    return await this.ticketRepository.update(unverifiedLookupObject, unverifiedUpdateObject);
  };

  /**
   * Not currently supported.
   * @param {Object} unverifiedLookupObject - The object to lookup the ticket to delete.
   * @returns {Promise<undefined>} Always returns undefined.
   */
  async delete(unverifiedLookupObject) {
    // return await this.ticketRepository.delete(unverifiedLookupObject);
    return undefined;
  };
}

module.exports = TicketService;

