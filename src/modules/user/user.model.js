const { v4: uuidv4 } = require('uuid');

const UserTypes = {
  pkey: "string",
  role: "string",
  username: "string",
  password: "string"
}

/*
  * User Model
  *
  * @param <string> username 
  * @param <string> password
  * @param <string> role 
  * @param <uuid:string> pkey
  * */
class User {
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


module.exports = { User, UserTypes }
