const { isValidUUID, isValidUsername, isValidPassword, isValidUserUpdate } = require("../../utils/validator.js");

/**
 * Service class for handling user-related operations.
 * @class UserService
 */
class UserService {
  /**
   * Creates an instance of the UserService.
   * @param {Object} userRepository - The repository for interacting with user data.
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Retrieves a specific user by their `pkey` (UUID) or `username`.
   * @param {Object} unverifiedLookupObject - The object containing the lookup criteria.
   * @param {string} [unverifiedLookupObject.pkey] - The unique identifier for the user (UUID).
   * @param {string} [unverifiedLookupObject.username] - The username of the user.
   * @returns {Promise<User | undefined>} The found user or `undefined` if invalid or not found.
   */
  async get(unverifiedLookupObject) {
    if (!(unverifiedLookupObject?.pkey || unverifiedLookupObject?.username)) {
      return undefined;
    }
    if (unverifiedLookupObject?.pkey && !isValidUUID(unverifiedLookupObject.pkey)) {
      return undefined;
    }
    if (unverifiedLookupObject?.username && !isValidUsername(unverifiedLookupObject.username)) {
      return undefined;
    }
    return await this.userRepository.get(unverifiedLookupObject);
  }

  /**
   * Retrieves all users.
   * @param {Object} [unverifiedLookupObject] - The optional object to filter users (not currently used).
   * @returns {Promise<User[] | undefined>} A list of users or `undefined` if invalid.
   */
  async read(unverifiedLookupObject) {
    return await this.userRepository.read(unverifiedLookupObject);
  }

  /**
   * Creates a new user.
   * @param {Object} unverifiedUserObject - The user object to create.
   * @param {string} unverifiedUserObject.username - The username of the new user.
   * @param {string} unverifiedUserObject.password - The password of the new user.
   * @returns {Promise<User | undefined>} The created user or `undefined` if invalid.
   */
  async create(unverifiedUserObject) {
    if (!unverifiedUserObject.username || !unverifiedUserObject.password) {
      return undefined;
    }
    if (!isValidUsername(unverifiedUserObject.username)) {
      return undefined;
    }
    if (!isValidPassword(unverifiedUserObject.password)) {
      return undefined;
    }
    const user = await this.userRepository.get(unverifiedUserObject);
    if (user) {
      return undefined;
    }
    return await this.userRepository.create(unverifiedUserObject);
  }

  /**
   * Updates an existing user's settings.
   * @param {Object} unverifiedLookupObject - The lookup object to identify the user.
   * @param {string} unverifiedLookupObject.pkey - The unique identifier of the user to update.
   * @param {Array<Object>} unverifiedUpdateObjects - The list of properties to update.
   * @param {string} unverifiedUpdateObjects[].property - The property of the user to update.
   * @param {string|number} unverifiedUpdateObjects[].value - The new value for the property.
   * @returns {Promise<User | undefined>} The updated user or `undefined` if invalid.
   */
  async update(unverifiedLookupObject, unverifiedUpdateObjects) {
    if (!unverifiedLookupObject?.pkey || !isValidUUID(unverifiedLookupObject.pkey)) {
      return undefined;
    }
    if (!isValidUserUpdate(unverifiedUpdateObjects)) {
      return undefined;
    }
    const user = await this.userRepository.get({ pkey: unverifiedLookupObject.pkey });
    if (!user) {
      return undefined;
    }
    return await this.userRepository.update(unverifiedLookupObject, unverifiedUpdateObjects);
  }

  /**
   * Deletes a user (not currently supported).
   * @param {Object} unverifiedLookupObject - The object containing the user lookup criteria.
   * @param {string} unverifiedLookupObject.pkey - The unique identifier of the user to delete.
   * @returns {Promise<User | undefined>} `undefined` since delete is not supported.
   */
  async delete(unverifiedLookupObject) {
    return undefined;
  }
}

module.exports = UserService;

