const { logger } = require('./utils/logging.js');

/**
 * Handle uncaught exceptions.
 *
 * This process event listener logs uncaught exceptions and forces the process to exit.
 * The error name and message are logged using the logger utility.
 *
 * @event process#uncaughtException
 * @param {Error} err - The uncaught exception error object.
 */
process.on('uncaughtException', err => {
  logger.error("Uncaught Exception: ", err.name, " : ", err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const app = require('./server/server.js');

/**
 * Start the server and listen for incoming requests.
 *
 * This starts the server on the specified port and host. The server address and port are logged
 * once the server has started.
 *
 * @param {number} PORT - The port on which the server will listen.
 * @param {string} HOST - The host address for the server.
 * @returns {Server} The server instance.
 */
const server = app.listen(PORT, HOST, () => {
  const address = server.address();
  logger.info(`Starting Server on ${address.address}:${address.port}`);
});

/**
 * Handle unhandled promise rejections.
 *
 * This process event listener logs unhandled promise rejections and gracefully shuts down the server.
 * After logging the error, it closes the server and exits the process with a code of 0.
 *
 * @event process#unhandledRejection
 * @param {Error} err - The unhandled rejection error object.
 */
process.on('unhandledRejection', err => {
  logger.error("Unhandled Rejection: ", err.name, " : ", err.message);
  server.close(() => {
    console.log("Gracefully shutting down");
    process.exit(0);
  });
});

