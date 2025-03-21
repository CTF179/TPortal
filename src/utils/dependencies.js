/*
  * Global Dependencies for the application
  *
  * This file handles the initialization and export of all the required service dependencies for the application.
  * It initializes repositories and services, which will be used across the application.
  */

/**
 * @module Dependencies
 */

/**
 * @constant {AuthRepository} authRepository
 * Initializes and exports an instance of the AuthRepository to handle authentication-related database interactions.
 */
const AuthRepository = require("../modules/auth/auth.dao.js");

/**
 * @constant {TicketRepository} ticketRepository
 * Initializes and exports an instance of the TicketRepository to handle ticket-related database interactions.
 */
const TicketRepository = require("../modules/ticket/ticket.dao.js");

/**
 * @constant {UserRepository} userRepository
 * Initializes and exports an instance of the UserRepository to handle user-related database interactions.
 */
const UserRepository = require("../modules/user/user.dao.js");

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const ticketRepository = new TicketRepository();

/**
 * @constant {AuthService} authService
 * Initializes and exports an instance of the AuthService, which contains business logic for handling authentication-related operations.
 */
const AuthService = require("../modules/auth/auth.service.js");

/**
 * @constant {TicketService} ticketService
 * Initializes and exports an instance of the TicketService, which contains business logic for handling ticket-related operations.
 */
const TicketService = require("../modules/ticket/ticket.service.js");

/**
 * @constant {UserService} userService
 * Initializes and exports an instance of the UserService, which contains business logic for handling user-related operations.
 */
const UserService = require("../modules/user/user.service.js");

const authService = new AuthService(authRepository);
const ticketService = new TicketService(ticketRepository);
const userService = new UserService(userRepository);

/**
 * @exports {Object} 
 * @property {TicketService} ticketService - Service for handling ticket-related logic.
 * @property {UserService} userService - Service for handling user-related logic.
 * @property {AuthService} authService - Service for handling authentication-related logic.
 */
module.exports = {
  ticketService,
  userService,
  authService,
};

