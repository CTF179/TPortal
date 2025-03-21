const { validate: isUUID } = require("uuid");
const { TicketTypes } = require("../modules/ticket/ticket.model.js");
const { UserTypes } = require("../modules/user/user.model.js");

/*
  * Check is uuid is a valid uuid
  * @param <string> uuid 
  * @returns <boolean> isValid
  * */
function isValidUUID(uuid) {
  let isValid = true;
  isValid &&= (typeof uuid == "string");
  isValid &&= isUUID(uuid);
  return isValid;
}

/*
  * Check if status is valid 
  * @param <string> status
  * @returns <boolean> isValid
  * */
function isValidStatus(status) {
  const statuses = ["pending", "approved", "denied", "all"];
  return statuses.includes(status);
}

/*
  * Check if description is valid 
  * @param <string> description
  * @returns <boolean> isValid
  * */
function isValidDescription(description) {
  let isValid = true;
  isValid &&= (description != "");
  isValid &&= (typeof description == TicketTypes["description"]);
  return isValid;
}


/*
  * Check if amount is valid
  * @param <Number> amount
  * @returns <boolean> isValid
  * */
function isValidAmount(amount) {
  let isValid = true;
  isValid &&= (amount > 0);
  isValid &&= (typeof amount == TicketTypes["amount"]);
  return isValid;
}

/*
  * Check if update object is valid
  * @param <{}> updateObject
  * @returns <boolean> isValid
  * */
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

/*
  * Check if username is valid
  * @param <string> username
  * @returns <boolean> isValid
  * */
function isValidUsername(username) {
  const specialChars = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;

  let isValid = true;
  isValid &&= (username != "");
  isValid &&= (typeof username == "string");
  isValid &&= (!specialChars.test(username));
  return isValid;
}

/*
  * Check if password is valid
  * @param <string> password
  * @returns <boolean> isValid
  * */
function isValidPassword(password) {

  let isValid = true;
  isValid &&= (password != "");
  isValid &&= (typeof password == "string");
  return isValid;
}

/*
  * Check if role is valid
  * @param <string> role 
  * @returns <boolean> isValid
  * */
function isValidRole(role) {
  const statuses = ["employee", "manager"];
  return statuses.includes(role);
}

/*
  * Check if user update is valid
  * @param <[]{property: string, value: typeof User.Property}> username
  * @returns <boolean> isValid
  * */
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
}
