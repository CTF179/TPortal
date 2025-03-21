const { authService } = require("../../utils/dependencies.js");

/**
 * Middleware for authenticating user requests.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.headers - The request headers.
 * @param {string} req.headers.authorization - The authorization token.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object|void} Returns an error response if authentication fails, otherwise calls next().
 */
const authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const tokenPayload = await authService.decodeToken(authHeader);
    req.user = { pkey: tokenPayload.pkey, role: tokenPayload.role };
    next();
  } catch (error) {
    logger.info(error);
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = { authentication };

