const { logger } = require("../../utils/logging.js");
const express = require("express");

/**
 * Controller class for managing user-related operations via HTTP requests.
 */
class UserController {
  /**
   * Creates a UserController instance.
   * @param {Object} userService - The service instance for user operations.
   */
  constructor(userService) {
    this.userService = userService;
    this.router = express.Router();
    this.initRoutes();
  }

  /**
   * Initializes routes for user-related operations.
   * @returns {void}
   */
  initRoutes() {
    this.router.get("/", this.get.bind(this));
    this.router.get("/:user_pkey", this.getUser.bind(this));
    this.router.post("/", this.postUser.bind(this));
    this.router.put("/:user_pkey", this.putUser.bind(this));
    this.router.delete("/", this.deleteUser.bind(this));
  }

  /**
   * Gets all users based on the role of the requesting admin.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Resolves to a response object.
   */
  async get(req, res) {
    try {
      const admin = req.user;
      if (!admin) {
        return res.status(400).json({ message: "Invalid User" });
      }

      switch (admin.role) {
        case "manager":
          const users = await this.userService.read({});
          if (!users) {
            return res.status(400).json({ message: "Invalid read" });
          }

          return res.status(200).json({ message: `${admin.pkey} request`, users: users });

        default:
          return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Read request failure" });
    }
  }

  /**
   * Gets a specific user based on their user_pkey.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Resolves to a response object.
   */
  async getUser(req, res) {
    try {
      const user_pkey = req.params.user_pkey;
      if (!user_pkey) {
        return res.status(400).json({ message: "Invalid User Key" });
      }

      const user = await this.userService.get({ pkey: user_pkey });
      if (!user) {
        return res.status(400).json({ message: "Invalid User" });
      }

      const admin = req.user;
      switch (admin.role) {
        case "manager":
          return res.status(200).json(user);

        default:
          return res.status(401).json({ message: "Not Available" });
      }

    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Get request failure" });
    }
  }

  /**
   * Creates a new user.
   * Only admin can create a user.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Resolves to a response object.
   */
  async postUser(req, res) {
    try {
      const data = req.body;
      if (!data) {
        return res.status(400).json({ message: "Invalid Object" });
      }

      const createduser = await this.userService.create(data);
      if (!createduser) {
        return res.status(400).json({ message: "Invalid User" });
      }

      return res.status(200).json({ message: `Created user:${createduser.pkey}`, user: { username: createduser.username, role: createduser.role } });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Creation request failure" });
    }
  }

  /**
   * Updates a specific user’s attributes.
   * Admin can update any user attribute.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Resolves to a response object.
   */
  async putUser(req, res) {
    try {
      const user_pkey = req.params.user_pkey;
      if (!user_pkey) {
        return res.status(400).json({ message: "Invalid User Key" });
      }

      const admin = req.user;
      if (!admin) {
        return res.status(400).json({ message: "Invalid User" });
      }

      switch (admin.role) {
        case "manager":
          const payload = req.body;
          if (!payload) {
            return res.status(400).json({ message: "Invalid Object" });
          }

          const updatedUser = await this.userService.update({ pkey: user_pkey }, payload.updateObjects);
          if (!updatedUser) {
            return res.status(400).json({ message: "Invalid Update" });
          }

          return res.status(200).json({
            message: `${updatedUser.username}:[${updatedUser.pkey}]; Updated by manager:[${admin.pkey}]`
          });

        default:
          return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Update request failure" });
    }
  }

  /**
   * Deletes a user. Currently not supported.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Resolves to a response object.
   */
  async deleteUser(req, res) {
    try {
      return res.status(405).json({ message: "Delete Not available" });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Delete request failure" });
    }
  }
}

module.exports = UserController;
