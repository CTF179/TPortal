const { isValidPassword } = require("../../utils/validator.js")

class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }
  /* 
    * Hash the user's password
    * @param <User> UnverifiedUserObject
    * @returns <User> UserWithHashedPassword
    * */
  async hashPassword(UnverifiedUserObject) {
    if (!UnverifiedUserObject?.password || !isValidPassword(UnverifiedUserObject.password)) {
      return undefined;
    }
    return await this.authRepository.hashPassword(UnverifiedUserObject);
  }

  /* 
    * 
    * @param <User> dbUser
    * @param <{password: string, username: string}> signInRequestUser
    * @returns <boolean> isValid;
    * */
  async validatePassword(dbUser, signInData) {
    return await this.authRepository.verify(dbUser.password, signInData.password);
  }

  /* 
    * Generate a token based on a user
    * @param <User> UnverifiedUserObject
    * @returns <Token> userToken
    * */
  async generateToken(UnverifiedUserObject) {
    return await this.authRepository.generateToken(UnverifiedUserObject);
  }

  /*
    * Decode a auth header
    * @param <req.header.authorization:string> unverifiedAuthHeader
    * @returns <{pkey:string, role:string}> userIdentifier
    * */
  async decodeToken(unverifiedAuthHeader) {
    return await this.authRepository.decodeToken(unverifiedAuthHeader);
  }

}

module.exports = AuthService;
