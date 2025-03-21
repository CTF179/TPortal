/*
  * Global Dependencies for the application
  * */
const AuthRepository = require("../modules/auth/auth.dao.js");
const TicketRepository = require("../modules/ticket/ticket.dao.js");
const UserRepository = require("../modules/user/user.dao.js");

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const ticketRepository = new TicketRepository();

const AuthService = require("../modules/auth/auth.service.js");
const TicketService = require("../modules/ticket/ticket.service.js");
const UserService = require("../modules/user/user.service.js");

const authService = new AuthService(authRepository);
const ticketService = new TicketService(ticketRepository);
const userService = new UserService(userRepository);

module.exports = {
  ticketService,
  userService,
  authService,
}

