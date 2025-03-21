const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

/**
 * DynamoDB Client Configuration
 * Creates a DynamoDB client instance for connecting to AWS DynamoDB.
 * @constant {DynamoDBClient}
 */
const client = new DynamoDBClient({ region: "us-east-2" });

/**
 * DynamoDB Document Client
 * A wrapper for easier working with DynamoDB documents, providing high-level APIs for document interactions.
 * @constant {DynamoDBDocumentClient}
 */
const dbConnector = DynamoDBDocumentClient.from(client);

module.exports = dbConnector;

