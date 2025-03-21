const { isValidUUID, isValidStatus, isValidDescription, isValidAmount, isValidTicketUpdate } = require("../../utils/validator.js");

class TicketService {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }
  /*
    * Verifies the input ticket lookup is valid
    * @param <{pkey:uuid}> unverifiedLookupObject
    * @returns <Ticket | undefined > ticket
    * */
  async get(unverifiedLookupObject) {
    if (!unverifiedLookupObject?.pkey || !isValidUUID(unverifiedLookupObject.pkey)) {
      return undefined;
    }
    return await this.ticketRepository.get(unverifiedLookupObject);
  };

  /*
    * Verifies the input ticket lookup is valid
    * @param <{pkey:uuid, status:string}> unverifiedLookupObject
    * @returns <[]Ticket | undefined > ticketArray
    * */
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

  /*
    * Verifies the input ticket is valid
    * @param <{owner: string, description:string, amount:number}> 
    * @returns <[]Ticket | undefined > ticketArray
    * */
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

  /*
    * Updating a ticket
    * @param <{pkey:uuid, status:string}> unverifiedLookupObject
    * @param <{property:string, value:typeof this.property}> unverifiedLookupObject
    * @returns <Ticket | undefined > ticket
    * */
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

  /*
    * Not currently supported.
    * */
  async delete(unverifiedLookupObject) {
    // return await this.ticketRepository.delete(unverifiedLookupObject);
    return undefined;
  };
}


module.exports = TicketService;
