const express = require("express")

class UserController {
  constructor(userService) {
    this.userService = userService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.get.bind(this));
    this.router.get("/:user_pkey", this.getUser.bind(this));
    this.router.post("/", this.postUser.bind(this));
    this.router.put("/:user_pkey", this.putUser.bind(this));
    this.router.delete("/", this.deleteUser.bind(this));
  }

  /*
    * Get all the current users.
    * Filtered by user
    * */
  async get(req, res) {
    try {
      const admin = req.user;
      if (!admin) {
        return res.status(400).json({ message: "Invalid User" })
      }

      switch (admin.role) {

        case "manager":
          const users = await this.userService.read({});
          if (!users) {
            return res.status(400).json({ message: "Invalid read" })
          }

          return res.status(200).json({ message: `${admin.pkey} request`, users: users });

        default:
          return res.status(401).json({ message: "Unathorized" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Read request failure" });
    }

  }

  /*
    * Get a specific user.
    * Owner can view their users; While manager can view every user
    * */
  async getUser(req, res) {
    try {
      const user_pkey = req.params.user_pkey
      if (!user_pkey) {
        return res.status(400).json({ message: "Invalid User Key" })
      }

      const user = await this.userService.get({ pkey: user_pkey });
      if (!user) {
        return res.status(400).json({ message: "Invalid User" })
      }

      const admin = req.user;
      switch (admin.role) {
        case "manager":
          return res.status(200).json(user);

        default:
          return res.status(401).json({ message: "Not Available" });
      }

    } catch (error) {
      return res.status(500).json({ message: "Get request failure" });
    }
  }

  /*
    * Create a specific User
    * Admin can create a user.
    * */
  async postUser(req, res) {
    try {
      const data = req.body;
      if (!data) {
        return res.status(400).json({ message: "Invalid Object" })
      }

      const createduser = await this.userService.create(data);
      if (!createduser) {
        return res.status(400).json({ message: "Invalid User" })
      }

      return res.status(200).json({ message: `Created user:${createduser.pkey}`, user: { username: createduser.username, role: createduser.role } })

    } catch (error) {
      return res.status(500).json({ message: "Creation request failure" });
    }
  }

  /*
    * Update multiple values.
    * Admin can update any user attribute.
    * */
  async putUser(req, res) {
    try {
      const user_pkey = req.params.user_pkey
      if (!user_pkey) {
        return res.status(400).json({ message: "Invalid User Key" })
      }

      const admin = req.user;
      if (!admin) {
        return res.status(400).json({ message: "Invalid User" })
      }

      switch (admin.role) {
        case "manager":
          const payload = req.body;
          if (!payload) {
            return res.status(400).json({ message: "Invalid Object" })
          }

          const updatedUser = await this.userService.update({ pkey: user_pkey }, payload.updateObjects);
          if (!updatedUser) {
            return res.status(400).json({ message: "Invalid Update" })
          }

          return res.status(200).json({
            message:
              `${updatedUser.username}:[${updatedUser.pkey}]; Updated by manager:[${admin.pkey}]`
          });

        default:
          return res.status(401).json({ message: "Unathorized" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Creation request failure" });
    }
  }

  /*
    * Delete a specific User
    * Admin can create a user.
    * */
  async deleteUser(req, res) {
    try {
      // const data = req.body;
      // const deletedUser = await this.userService.delete(data);
      // return res.status(200).json({ message: `Deleted user:${deletedUser.pkey}`, user: { username: createduser.username, role: deletedUser.role } })
      return res.status(405).json({ message: "Delete Not available " })
    } catch (error) {
      return res.status(500).json({ message: "Creation request failure" });
    }
  }
}


module.exports = UserController
