const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


class AuthRepository {
  constructor() {
    this.secretKey = process.env.SECRET;
  }
  /* 
    * Hash the user's password
    * @param <User> userObject
    * @returns <User> UserWithHashedPassword
    * */
  async hashPassword(userObject) {
    const saltRounds = 10;
    userObject.password = await bcrypt.hash(userObject.password, saltRounds);
    return userObject;
  }
  /* 
    * Verify that sign in is correct
    * @param <HashedDBPass> hashedPass
    * @param <string> user password
    * @returns <User> UserWithHashedPassword
    * */
  async verify(hashedPass, signInText) {
    const result = await bcrypt.compare(signInText, hashedPass);
    return result;
  }

  /*
    * Generate a token for a user
    * @param <User> UserObject 
    * @returns <{pkey:string, role:string}> requiredUserIdentity
    * */
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
    )
    return token;
  };

  /*
    * Decode a token
    * @param <AuthHeader> 
    * @returns <{pkey:string, role:string}> requiredUserIdentity
    * */
  async decodeToken(AuthHeader) {
    const jwtToken = AuthHeader.split(" ")[1];
    const userObject = jwt.verify(jwtToken, this.secretKey);
    return userObject;
  }

}

module.exports = AuthRepository;
