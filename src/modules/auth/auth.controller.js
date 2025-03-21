const { logger } = require("../../utils/logging.js")
const express = require("express");

/**
 * Controller for handling authentication-related requests.
 */
class AuthController {
  /**
   * Initializes the authentication controller.
   * @param {Object} authService - Service for handling authentication logic.
   * @param {Object} userService - Service for handling user-related operations.
   */
  constructor(authService, userService) {
    this.authService = authService;
    this.userService = userService;
    this.router = express.Router();
    this.initRoutes();
  }

  /**
   * Initializes authentication-related routes.
   */
  initRoutes() {
    this.router.post("/register", this.register.bind(this));
    this.router.post("/login", this.login.bind(this));
  }

  /**
   * Handles user registration.
   * @param {Object} req - Express request object containing user registration data.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response indicating success or failure.
   */
  async register(req, res) {
    try {
      let data = req.body;
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: "Invalid Body" });
      }

      data = await this.authService.hashPassword(data);
      if (!data) {
        return res.status(400).json({ message: "Invalid Password" });
      }

      const createdUser = await this.userService.create(data);
      if (!createdUser) {
        return res.status(400).json({ message: "Invalid User" });
      }

      const loginToken = await this.authService.generateToken(createdUser);
      if (!loginToken) {
        return res.status(400).json({ message: "Invalid Token" });
      }

      return res.status(201).json({
        message: "Successful account creation",
        user: { username: createdUser.username, role: createdUser.role },
        token: loginToken
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Registration Error" });
    }
  }

  /**
   * Handles user login.
   * @param {Object} req - Express request object containing user login credentials.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response indicating success or failure.
   */
  async login(req, res) {
    try {
      const userObject = req.body;
      if (Object.keys(userObject).length === 0) {
        return res.status(400).json({ message: "Invalid Object" });
      }

      const user = await this.userService.get(userObject);
      if (!user) {
        return res.status(400).json({ message: "Invalid User" });
      }

      const isCorrectPassword = await this.authService.validatePassword(user, userObject);
      if (!isCorrectPassword) {
        return res.status(401).json({ message: "Invalid Signin" });
      }

      const loginToken = await this.authService.generateToken(user);
      if (!loginToken) {
        return res.status(400).json({ message: "Invalid Token" });
      }

      return res.status(200).json({
        message: "Successful sign in",
        user: { username: user.username, role: user.role },
        token: loginToken
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Login Error" });
    }
  }
}

module.exports = AuthController;

