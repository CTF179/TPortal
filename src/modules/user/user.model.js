const { v4: uuidv4 } = require('uuid');

/**
 * Defines the structure of a User object, outlining the expected properties.
 * @typedef {Object} UserTypes
 * @property {string} pkey - The unique identifier for the user (UUID).
 * @property {string} role - The role of the user (e.g., "employee").
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 */
const UserTypes = {
  pkey: "string",
  role: "string",
  username: "string",
  password: "string"
};

/**
 * User Model representing a user in the system.
 * @class
 */
class User {
  /**
   * Creates an instance of a User.
   * @param {Object} param0 - The properties for the user.
   * @param {string} param0.username - The username of the user.
   * @param {string} param0.password - The password of the user.
   * @param {string} [param0.role="employee"] - The role of the user (default is "employee").
   * @param {string} [param0.pkey=uuidv4()] - The unique identifier for the user, default is generated via `uuidv4`.
   */
  constructor({
    pkey = uuidv4(),
    role = "employee",
    username,
    password
  } = {}) {
    this.pkey = pkey;
    this.role = role;
    this.username = username;
    this.password = password;
  }
}

module.exports = { User, UserTypes };

