/*
  * Middleware for Authorization
  *
  * We only allow specified roles to pass through
  *
  * @param <[]User.roles> roles
  * @returns <http.response> error
  * */
const authorization = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  }
}

module.exports = {
  authorization
}
