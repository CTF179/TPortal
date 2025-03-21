const { logger } = require("../../utils/logging.js");
const { Ticket } = require('./ticket.model.js')
const { GetCommand, PutCommand, ScanCommand, DeleteCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

/*
  * @Class LocalTicketContainer 
  * */
class TicketRepository {
  constructor() {
    this.tableName = "Tickets"
    this.dbConnector = require("../../utils/dbconnector.js");
  }

  /*
    * Retrieves a Ticket using partition key (pkey) from memory
    * @param <{pkey: uuidv4}> pkey
    * @returns <Ticket | undefined> foundTicket
    * */
  async get(lookupObject) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { pkey: lookupObject.pkey, },
    });
    try {
      const data = await this.dbConnector.send(command);
      return new Ticket(data.Item);
    } catch (err) {
      return undefined;
    }
  }

  /*
    * Retrieves all tickets 
    * @param <{owner: uuid, status: string}>
    * @returns <[]Tickets> foundTickets
    * */
  async read(lookupObject = {}) {
    let command;
    let data;

    if (lookupObject.owner) {
      // TODO: Refactor to use a secondary index rather than scan
      command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#owner = :owner",
        ExpressionAttributeNames: { "#owner": "owner" },
        ExpressionAttributeValues: { ":owner": lookupObject.owner }
      });
    }

    if (lookupObject.status && lookupObject.status != 'all') {
      // TODO: Refactor to use a secondary index rather than scan
      command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": lookupObject.status }
      });

    }

    if (lookupObject.status == 'all') {
      // TODO: Refactor to use a secondary index rather than scan
      command = new ScanCommand({
        TableName: this.tableName
      });
    }

    try {
      data = await this.dbConnector.send(command);
      return data.Items
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }

  /*
    * Creates a ticket 
    * @param <Ticket> ticketObject 
    * @returns <Ticket> createTicket
    * */
  async create(ticketObject) {
    const newTicket = new Ticket(ticketObject);

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...newTicket
      },
    });

    try {
      await this.dbConnector.send(command);
      return newTicket;
    } catch (err) {
      logger.info(err);
      return undefined;
    }
  }

  /*
    * Deletes a ticket
    * @param <pkey:uuid> pkey
    * @returns <Ticket> deletedTicket
    * */
  async delete(lookupObject) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { pkey: lookupObject.pkey }
    });

    try {
      const response = await this.dbConnector.send(command);
      return response.Item;
    } catch (err) {
      logger.info(err);
      return undefined;
    }
  }

  /*
    * Updates a ticket 
    * @param <LookupObject> pkey
    * @param <[]{property:string, value: typeof(property)}> updateObjects
    * @returns <Ticket> ticket
    * */
  async update(lookupObject, updateObjects) {
    let expression = "set "
    let attributeNames = {}
    let attributeValues = {}
    for (let i = 0, l = updateObjects.length; i < l; i++) {
      expression += `#${updateObjects[i].property}${i}=:${updateObjects[i].property}${i}`
      attributeNames[`#${updateObjects[i].property}${i}`] = `${updateObjects[i].property}`;
      attributeValues[`:${updateObjects[i].property}${i}`] = `${updateObjects[i].value}`;
      if (i + 1 != l) {
        expression += ", "
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
      return new Ticket(response.Attributes);
    } catch (err) {
      logger.info(err);
      return undefined;
    }
  }
}

module.exports = TicketRepository;
