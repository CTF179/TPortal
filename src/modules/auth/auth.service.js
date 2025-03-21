const { isValidPassword } = require("../../utils/validator.js");

/**
 * Service for handling authentication operations.
 */
class AuthService {
  /**
   * Initializes the authentication service.
   * @param {Object} authRepository - The authentication repository for handling auth-related operations.
   */
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  /**
   * Hashes a user's password.
   * @param {Object} UnverifiedUserObject - The user object containing an unhashed password.
   * @param {string} UnverifiedUserObject.password - The plaintext password.
   * @returns {Promise<Object|undefined>} The user object with a hashed password, or undefined if invalid.
   */
  async hashPassword(UnverifiedUserObject) {
    if (!UnverifiedUserObject?.password || !isValidPassword(UnverifiedUserObject.password)) {
      return undefined;
    }
    return await this.authRepository.hashPassword(UnverifiedUserObject);
  }

  /**
   * Validates a user's password.
   * @param {Object} dbUser - The stored user object containing the hashed password.
   * @param {Object} signInData - The login request object.
   * @param {string} signInData.password - The plaintext password to validate.
   * @returns {Promise<boolean>} True if the password is valid, otherwise false.
   */
  async validatePassword(dbUser, signInData) {
    return await this.authRepository.verify(dbUser.password, signInData.password);
  }

  /**
   * Generates a token for a user.
   * @param {Object} UnverifiedUserObject - The user object containing identity details.
   * @returns {Promise<string>} A signed authentication token.
   */
  async generateToken(UnverifiedUserObject) {
    return await this.authRepository.generateToken(UnverifiedUserObject);
  }

  /**
   * Decodes an authentication token from the authorization header.
   * @param {string} unverifiedAuthHeader - The authorization header containing the token.
   * @returns {Promise<Object>} The decoded user identity object.
   */
  async decodeToken(unverifiedAuthHeader) {
    return await this.authRepository.decodeToken(unverifiedAuthHeader);
  }
}

module.exports = AuthService;

