const { createLogger, transports, format } = require('winston');

/*
  * Utility Logger for Winston
  * */
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp}[${level}]: ${message}`;
    })),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app.log" })
  ],
})

/*
  * Logger middleware
  * */
const requestMiddleware = (req, res, next) => {
  try {
    logger.info(`[${req.ip}]: Inbound ${req.method} ${req.url} `);
    next();
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: "Logging error" });
  }
}
const responseMiddleware = (req, res, next) => {
  const response = res.json;
  res.json = function(body) {
    logger.info(`[${req.ip}]: Outbound ${req.method} [${res.statusCode}]: ${JSON.stringify(body?.message)}`);
    return response.apply(this, arguments);
  }
  next();
}

/*
  * Disable Winston during Jest Testing 
  * */
if (process.env.NODE_ENV === 'test') {
  logger.clear();
}

module.exports = {
  requestMiddleware,
  responseMiddleware,
  logger,
}
