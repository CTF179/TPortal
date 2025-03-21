const { isValidUUID, isValidUsername, isValidPassword, isValidUserUpdate } = require("../../utils/validator.js")
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /*
    * Get a specific user by pkey or username 
    * @param <{pkey: uuid, username: string }> unverifiedLookupObject
    * @returns <User | undefined> foundUser
    * */
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
  };

  /*
    * Get all users
    * @param <{}> unverifiedLookupObject
    * @returns <[]User | undefined> foundUsers
    * */
  async read(unverifiedLookupObject) {
    // What would make this invalid? 
    return await this.userRepository.read(unverifiedLookupObject);
  };

  /*
    * Create a user
    * @param <User> unverifiedUserObject
    * @returns <User | undefined> createdUser
    * */
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
  };

  /*
    * Update user settings
    * @param <{pkey: uuid}> unverifiedLookupObject
    * @param <[]{property: string, value: typeof User.property}> unverifiedUpdateObjects
    * @returns <User | undefined> updatedUser
    * */
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
  };

  /*
    * Not currently supported
    * @param <{pkey: uuid}> unverifiedLookupObject
    * @returns <User | undefined> deletedUser
    * */
  async delete(unverifiedLookupObject) {
    return undefined
  };
}

module.exports = UserService;
