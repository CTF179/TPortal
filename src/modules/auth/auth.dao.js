const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Repository for handling authentication operations such as password hashing, verification, and token management.
 */
class AuthRepository {
  /**
   * Initializes the authentication repository.
   */
  constructor() {
    this.secretKey = process.env.SECRET;
  }

  /**
   * Hashes the user's password.
   * @param {Object} userObject - The user object containing the password.
   * @returns {Promise<Object>} The user object with the hashed password.
   */
  async hashPassword(userObject) {
    const saltRounds = 10;
    userObject.password = await bcrypt.hash(userObject.password, saltRounds);
    return userObject;
  }

  /**
   * Verifies that the provided password matches the stored hashed password.
   * @param {string} hashedPass - The hashed password from the database.
   * @param {string} signInText - The user-provided password.
   * @returns {Promise<boolean>} True if the password matches, otherwise false.
   */
  async verify(hashedPass, signInText) {
    const result = await bcrypt.compare(signInText, hashedPass);
    return result;
  }

  /**
   * Generates a JWT token for a user.
   * @param {Object} UserObject - The user object containing necessary identity information.
   * @param {string} UserObject.pkey - The primary key or identifier for the user.
   * @param {string} UserObject.role - The user's role.
   * @returns {Promise<string>} A signed JWT token.
   */
  async generateToken(UserObject) {
    const token = jwt.sign(
      {
        pkey: UserObject.pkey,
        role: UserObject.role
      },
      this.secretKey,
      {
        expiresIn: "15m"
      }
    );
    return token;
  }

  /**
   * Decodes and verifies a JWT token.
   * @param {string} AuthHeader - The authorization header containing the token.
   * @returns {Promise<Object>} The decoded user identity object.
   */
  async decodeToken(AuthHeader) {
    const jwtToken = AuthHeader.split(" ")[1];
    const userObject = jwt.verify(jwtToken, this.secretKey);
    return userObject;
  }
}

module.exports = AuthRepository;

