const { validate: isUUID } = require("uuid");
const { TicketTypes } = require("../modules/ticket/ticket.model.js");
const { UserTypes } = require("../modules/user/user.model.js");

/**
 * Check if a UUID is valid.
 *
 * This function checks if the provided UUID is a valid string and conforms to UUID format.
 *
 * @param {string} uuid - The UUID string to be validated.
 * @returns {boolean} - Returns true if the UUID is valid, otherwise false.
 */
function isValidUUID(uuid) {
  let isValid = true;
  isValid &&= (typeof uuid == "string");
  isValid &&= isUUID(uuid);
  return isValid;
}

/**
 * Check if the provided status is valid.
 *
 * This function checks if the given status is one of the predefined valid statuses for a ticket.
 *
 * @param {string} status - The status string to be validated.
 * @returns {boolean} - Returns true if the status is valid, otherwise false.
 */
function isValidStatus(status) {
  const statuses = ["pending", "approved", "denied", "all"];
  return statuses.includes(status);
}

/**
 * Check if the description is valid.
 *
 * This function checks if the provided description is a valid string and matches the expected type for ticket descriptions.
 *
 * @param {string} description - The description string to be validated.
 * @returns {boolean} - Returns true if the description is valid, otherwise false.
 */
function isValidDescription(description) {
  let isValid = true;
  isValid &&= (description != "");
  isValid &&= (typeof description == TicketTypes["description"]);
  return isValid;
}

/**
 * Check if the amount is valid.
 *
 * This function checks if the provided amount is a positive number and matches the expected type for ticket amounts.
 *
 * @param {number} amount - The amount to be validated.
 * @returns {boolean} - Returns true if the amount is valid, otherwise false.
 */
function isValidAmount(amount) {
  let isValid = true;
  isValid &&= (amount > 0);
  isValid &&= (typeof amount == TicketTypes["amount"]);
  return isValid;
}

/**
 * Check if the ticket update object is valid.
 *
 * This function checks if the properties of the ticket update object are valid, ensuring each property and value conform to expected types and rules.
 *
 * @param {Array<{property: string, value: any}>} updateObjects - The array of ticket updates to be validated.
 * @returns {boolean} - Returns true if the update object is valid, otherwise false.
 */
function isValidTicketUpdate(updateObjects) {
  let isValid = true;
  for (const update of updateObjects) {

    isValid &&= (TicketTypes[update?.property]);
    if (!isValid) { break; }

    isValid &&= (typeof update?.value == TicketTypes[update?.property]);
    if (!isValid) { break; }

    switch (update?.property) {
      case "pkey":
      case "processor":
      case "owner":
        isValid &&= isValidUUID(update.value);
        break;
      case "status":
        isValid &&= isValidStatus(update.value);
        break;
      case "amount":
        isValid &&= isValidAmount(update.value);
        break;
      case "description":
        isValid &&= isValidDescription(update.value);
        break;
      default:
        isValid &&= false;
        break;
    }
    if (!isValid) { break; }
  }
  return !!isValid;
}

/**
 * Check if the username is valid.
 *
 * This function checks if the provided username is a valid string and does not contain special characters.
 *
 * @param {string} username - The username string to be validated.
 * @returns {boolean} - Returns true if the username is valid, otherwise false.
 */
function isValidUsername(username) {
  const specialChars = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;

  let isValid = true;
  isValid &&= (username != "");
  isValid &&= (typeof username == "string");
  isValid &&= (!specialChars.test(username));
  return isValid;
}

/**
 * Check if the password is valid.
 *
 * This function checks if the provided password is a non-empty string.
 *
 * @param {string} password - The password string to be validated.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 */
function isValidPassword(password) {

  let isValid = true;
  isValid &&= (password != "");
  isValid &&= (typeof password == "string");
  return isValid;
}

/**
 * Check if the role is valid.
 *
 * This function checks if the provided role is one of the valid roles defined for the user.
 *
 * @param {string} role - The role string to be validated.
 * @returns {boolean} - Returns true if the role is valid, otherwise false.
 */
function isValidRole(role) {
  const statuses = ["employee", "manager"];
  return statuses.includes(role);
}

/**
 * Check if the user update object is valid.
 *
 * This function checks if the properties of the user update object are valid, ensuring each property and value conform to expected types and rules.
 *
 * @param {Array<{property: string, value: any}>} updateObjects - The array of user updates to be validated.
 * @returns {boolean} - Returns true if the update object is valid, otherwise false.
 */
function isValidUserUpdate(updateObjects) {
  let isValid = true;
  for (const update of updateObjects) {

    isValid &&= (UserTypes[update?.property]);
    if (!isValid) { break; }

    isValid &&= (typeof update?.value == UserTypes[update?.property]);
    if (!isValid) { break; }

    switch (update?.property) {
      case "pkey":
        isValid &&= isValidUUID(update.value);
        break;
      case "role":
        isValid &&= isValidRole(update.value);
        break;
      case "username":
        isValid &&= isValidUsername(update.value);
        break;
      case "password":
        isValid &&= isValidPassword(update.value);
        break;
      default:
        isValid &&= false;
        break;
    }
    if (!isValid) { break; }
  }
  return !!isValid;
}

module.exports = {
  isValidUUID,
  isValidStatus,
  isValidTicketUpdate,
  isValidAmount,
  isValidDescription,
  isValidUsername,
  isValidPassword,
  isValidRole,
  isValidUserUpdate,
};

