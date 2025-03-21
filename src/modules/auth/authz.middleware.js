/**
 * Middleware for Authorization.
 *
 * Allows only specified roles to access certain routes.
 *
 * @param {string[]} roles - An array of allowed user roles.
 * @returns {Function} Express middleware function.
 */
const authorization = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = {
  authorization,
};

