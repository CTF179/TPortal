const { logger } = require("../../utils/logging.js");
const { User } = require("./user.model.js");
const { GetCommand, PutCommand, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

/**
 * Repository class for managing user-related database operations.
 * Interacts with the DynamoDB table for user records.
 * @class UserRepository
 */
class UserRepository {
  /**
   * Creates an instance of UserRepository.
   */
  constructor() {
    this.tableName = "Users";
    this.dbConnector = require("../../utils/dbconnector.js");
  }

  /**
   * Retrieves a user by either partition key (`pkey`) or username.
   * @param {Object} lookupObject - The object containing search criteria.
   * @param {string | number} [lookupObject.pkey] - The unique identifier (UUID or integer) for the user.
   * @param {string} [lookupObject.username] - The username to search for.
   * @returns {User | undefined} - The user object if found, otherwise undefined.
   */
  async get(lookupObject) {
    let command;
    if (lookupObject.pkey) {
      command = new GetCommand({
        TableName: this.tableName,
        Key: { pkey: lookupObject.pkey }
      });
      try {
        const data = await this.dbConnector.send(command);
        const user = data.Item;
        Object.setPrototypeOf(user, User);
        return user;
      } catch (error) {
        logger.error(error);
        return null;
      }
    }
    if (lookupObject.username) {
      command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#usern=:username",
        ExpressionAttributeNames: { "#usern": "username" },
        ExpressionAttributeValues: { ":username": lookupObject.username }
      });

      try {
        const data = await this.dbConnector.send(command);
        const user = data.Items[0];
        Object.setPrototypeOf(user, User);
        return user;
      } catch (error) {
        logger.error(error);
        return null;
      }
    }

    return null;
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} - An array of User objects.
   */
  async read() {
    let command = new ScanCommand({
      TableName: this.tableName,
    });
    try {
      const data = await this.dbConnector.send(command);
      return data.Items;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  /**
   * Creates a new user in the database.
   * @param {User} userObject - The user data to be saved.
   * @returns {User | null} - The created user object if successful, otherwise null.
   */
  async create(userObject) {
    const user = new User(userObject);
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...user
      },
      ReturnValues: "ALL_OLD"
    });
    try {
      await this.dbConnector.send(command);
      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  /**
   * Deletes a user from the database.
   * Currently not implemented.
   * @param {Object} lookupObject - The object containing the `pkey` of the user to be deleted.
   * @param {string | number} lookupObject.pkey - The unique identifier (UUID or integer) of the user.
   * @returns {null} - Always returns null as delete functionality is not supported yet.
   */
  async delete(lookupObject) {
    return null;
  }

  /**
   * Updates a user's attributes in the database.
   * @param {Object} lookupObject - The object containing the `pkey` of the user to update.
   * @param {Array<Object>} updateObjects - Array of objects containing `property` and `value` for each attribute to update.
   * @param {string} updateObjects[].property - The property of the user to update.
   * @param {string | number} updateObjects[].value - The new value for the property.
   * @returns {Object | null} - The updated user attributes if successful, otherwise null.
   */
  async update(lookupObject, updateObjects) {
    let expression = "set ";
    let attributeNames = {};
    let attributeValues = {};
    for (let i = 0, l = updateObjects.length; i < l; i++) {
      expression += `#${updateObjects[i].property}${i}=:${updateObjects[i].property}${i}`;
      attributeNames[`#${updateObjects[i].property}${i}`] = `${updateObjects[i].property}`;
      attributeValues[`:${updateObjects[i].property}${i}`] = `${updateObjects[i].value}`;
      if (i + 1 != l) {
        expression += ",";
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
      return response.Attributes;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

module.exports = UserRepository;

