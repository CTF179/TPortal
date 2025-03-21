const express = require('express');
const cors = require('cors');

/**
 * Application Controllers
 * @module controllers
 */
const AuthController = require('../modules/auth/auth.controller.js');
const TicketController = require('../modules/ticket/ticket.controller.js');
const UserController = require('../modules/user/user.controller.js');
const { authService, userService, ticketService } = require("../utils/dependencies.js");

const authController = new AuthController(authService, userService);
const ticketController = new TicketController(ticketService);
const userController = new UserController(userService);

/**
 * Middleware for logging requests and responses.
 * @module middleware
 */
const { requestMiddleware, responseMiddleware } = require("../utils/logging.js");
const { authentication } = require("../modules/auth/auth.middleware.js");
const { authorization } = require("../modules/auth/authz.middleware.js");

/**
 * Application setup and routing configuration.
 * @module app
 */
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());

app.use(requestMiddleware);
app.use(responseMiddleware);

app.use("/", authController.router);
app.use('/ticket', authentication, authorization(['employee', 'manager']), ticketController.router);
app.use('/users', authentication, authorization(['manager']), userController.router);

module.exports = app;

