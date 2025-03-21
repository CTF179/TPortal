const { createLogger, transports, format } = require('winston');

/**
 * Utility Logger for Winston
 *
 * Initializes a logger using the Winston logging library, which logs messages to both the console and a file.
 * The logger uses a custom format that includes a timestamp and the log level.
 *
 * @constant {Logger} logger
 */
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp}[${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app.log" })
  ],
});

/**
 * Logger middleware for incoming requests
 *
 * This middleware logs information about incoming HTTP requests, including the client's IP address, HTTP method, and URL.
 * It is used to log each incoming request before passing control to the next middleware.
 *
 * @function requestMiddleware
 * @param {Request} req - The incoming HTTP request object.
 * @param {Response} res - The outgoing HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
const requestMiddleware = (req, res, next) => {
  try {
    logger.info(`[${req.ip}]: Inbound ${req.method} ${req.url} `);
    next();
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: "Logging error" });
  }
};

/**
 * Logger middleware for outgoing responses
 *
 * This middleware logs the response details, including the client's IP address, HTTP method, response status code, and any message 
 * included in the response body. It modifies the `res.json` method to log this information before sending the response.
 *
 * @function responseMiddleware
 * @param {Request} req - The incoming HTTP request object.
 * @param {Response} res - The outgoing HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
const responseMiddleware = (req, res, next) => {
  const response = res.json;
  res.json = function(body) {
    logger.info(`[${req.ip}]: Outbound ${req.method} [${res.statusCode}]: ${JSON.stringify(body?.message)}`);
    return response.apply(this, arguments);
  };
  next();
};

/**
 * Disables Winston logging during Jest testing
 *
 * If the application is running in a test environment (i.e., `NODE_ENV` is set to 'test'), the Winston logger is cleared 
 * to prevent unnecessary log output during tests.
 *
 * @function clearLoggerDuringTest
 * @returns {void}
 */
if (process.env.NODE_ENV === 'test') {
  logger.clear();
}

module.exports = {
  requestMiddleware,
  responseMiddleware,
  logger,
};

