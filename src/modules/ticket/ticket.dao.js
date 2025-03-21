const { logger } = require("../../utils/logging.js");
const { Ticket } = require("./ticket.model.js");
const { GetCommand, PutCommand, ScanCommand, DeleteCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

/**
 * TicketRepository handles CRUD operations for the Ticket model.
 */
class TicketRepository {
  constructor() {
    this.tableName = "Tickets";
    this.dbConnector = require("../../utils/dbconnector.js");
  }

  /**
   * Retrieves a ticket using its partition key (pkey).
   * @param {Object} lookupObject - The lookup object containing the ticket's pkey.
   * @param {string} lookupObject.pkey - The unique identifier for the ticket.
   * @returns {Promise<Ticket|undefined>} The found ticket or undefined if not found.
   */
  async get(lookupObject) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { pkey: lookupObject.pkey },
    });
    try {
      const data = await this.dbConnector.send(command);
      return data.Item ? new Ticket(data.Item) : undefined;
    } catch (error) {
      logger.error(error);
      return undefined;
    }
  }

  /**
   * Retrieves all tickets based on optional filters.
   * @param {Object} [lookupObject={}] - The lookup object containing filter parameters.
   * @param {string} [lookupObject.owner] - The owner's UUID to filter tickets.
   * @param {string} [lookupObject.status] - The status to filter tickets (default is 'all').
   * @returns {Promise<Ticket[]>} The list of found tickets.
   */
  async read(lookupObject = {}) {
    let command;

    if (lookupObject.owner) {
      command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#owner = :owner",
        ExpressionAttributeNames: { "#owner": "owner" },
        ExpressionAttributeValues: { ":owner": lookupObject.owner },
      });
    } else if (lookupObject.status && lookupObject.status !== "all") {
      command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": lookupObject.status },
      });
    } else {
      command = new ScanCommand({ TableName: this.tableName });
    }

    try {
      const data = await this.dbConnector.send(command);
      return data.Items || [];
    } catch (error) {
      logger.error(error);
      return [];
    }
  }

  /**
   * Creates a new ticket.
   * @param {Ticket} ticketObject - The ticket object to create.
   * @returns {Promise<Ticket|undefined>} The created ticket or undefined on failure.
   */
  async create(ticketObject) {
    const newTicket = new Ticket(ticketObject);
    const command = new PutCommand({
      TableName: this.tableName,
      Item: { ...newTicket },
    });

    try {
      await this.dbConnector.send(command);
      return newTicket;
    } catch (error) {
      logger.info(error);
      return undefined;
    }
  }

  /**
   * Deletes a ticket by its partition key (pkey).
   * @param {Object} lookupObject - The lookup object containing the ticket's pkey.
   * @param {string} lookupObject.pkey - The unique identifier for the ticket.
   * @returns {Promise<Ticket|undefined>} The deleted ticket or undefined on failure.
   */
  async delete(lookupObject) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { pkey: lookupObject.pkey },
    });

    try {
      const response = await this.dbConnector.send(command);
      return response.Attributes ? new Ticket(response.Attributes) : undefined;
    } catch (error) {
      logger.error(error);
      return undefined;
    }
  }

  /**
   * Updates a ticket's attributes.
   * @param {Object} lookupObject - The lookup object containing the ticket's pkey.
   * @param {string} lookupObject.pkey - The unique identifier for the ticket.
   * @param {Array<{property: string, value: any}>} updateObjects - List of properties and values to update.
   * @returns {Promise<Ticket|undefined>} The updated ticket or undefined on failure.
   */
  async update(lookupObject, updateObjects) {
    let expression = "set ";
    let attributeNames = {};
    let attributeValues = {};

    for (let i = 0; i < updateObjects.length; i++) {
      const prop = updateObjects[i].property;
      const value = updateObjects[i].value;
      expression += `#${prop}${i} = :${prop}${i}`;
      attributeNames[`#${prop}${i}`] = prop;
      attributeValues[":" + prop + i] = value;
      if (i + 1 !== updateObjects.length) {
        expression += ", ";
      }
    }

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { pkey: lookupObject.pkey },
      UpdateExpression: expression,
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
      ReturnValues: "ALL_NEW",
    });

    try {
      const response = await this.dbConnector.send(command);
      return response.Attributes ? new Ticket(response.Attributes) : undefined;
    } catch (error) {
      logger.error(error);
      return undefined;
    }
  }
}

module.exports = TicketRepository;
