const { logger } = require("../../utils/logging.js");
const { User } = require("./user.model.js")
const { GetCommand, PutCommand, ScanCommand, paginateScan, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

/*
  * @Class UserRepository
  * */
class UserRepository {
  constructor() {
    this.tableName = "Users"
    this.dbConnector = require("../../utils/dbconnector.js");
  }

  /*
    * Retrieves a user using partition key (pkey)
    * @param <{pkey: uuidv4 | int, username: string}> pkey
    * @returns <User | undefined> foundUser
    * */
  async get(lookupObject) {
    let command;
    if (lookupObject.pkey) {
      command = new GetCommand({
        TableName: this.tableName,
        Key: { pkey: lookupObject.pkey }
      })
      try {
        const data = await this.dbConnector.send(command);
        const user = data.Item;
        Object.setPrototypeOf(user, User);
        return user;
      } catch (err) {
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
        return user
      } catch (err) {
        return null;
      }
    }

    return null;
  }

  /*
    * Retrieves all users
    * @param <> LookupObject
    * @returns <[]User> foundUser
    * */
  async read(_) {
    let command = new ScanCommand({
      TableName: this.tableName,
    });
    try {
      const data = await this.dbConnector.send(command);
      return data.Items;
    } catch (err) {
      return null
    }
  }

  /*
    * Creates a user 
    * @param <User> userObject
    * @returns <User> createdUser
    * */
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
    } catch (err) {
      logger.error(err);
      return null;
    };
  }

  /*
    * Deletes a user 
    * @param <{pkey: uuid}> lookupObject
    * @returns <User> createdUser
    * */
  async delete(lookupObject) {
    return null;
  }

  /*
    * Upates a user 
    * @param <LookupObject> lookupObject
    * @returns <updateObject> updateObject
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
        expression += ","
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
    } catch (err) {
      logger.info(err);
      return null;
    }
  }
}

module.exports = UserRepository;

