const { authService } = require("../../utils/dependencies.js");

/*
  * Middleware for Authentication 
  * @param <http.request> req
  * @param <http.response> res
  * @param <http.handler | middleware> next
  * @returns <http.response> error
  * */
const authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "Unathorized" });
  }
  try {
    const tokenPayload = await authService.decodeToken(authHeader);
    req.user = { pkey: tokenPayload.pkey, role: tokenPayload.role };
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" })
  }
}





module.exports = { authentication }
