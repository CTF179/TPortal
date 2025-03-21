const { logger } = require('./utils/logging.js')

process.on('uncaughtException', err => {
  logger.error("Uncaught Exception: ", err.name, " : ", err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const app = require('./server/server.js');

const server = app.listen(PORT, HOST, () => {
  const address = server.address();
  logger.info(`Starting Server on ${address.address}:${address.port}`)
});

process.on('unhandledRejection', err => {
  logger.error("Unhandled Rejection: ", err.name, " : ", err.message);
  server.close(() => {
    console.log("Gracefully shutting down");
    process.exit(0);
  })
});
