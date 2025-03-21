

describe("Auth Repository", () => {
  const AuthRepository = require("../../../src/modules/auth/auth.dao.js")
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");

  jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
    verify: jest.fn(),
  }));

  jest.mock("bcrypt", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
  }));

  let authRepo;

  beforeEach(() => {
    authRepo = new AuthRepository();
    authRepo.secretKey = "SECRET-KEY"
  })

  /*
    * Hashes the user password 
    * */
  it("should hash the password", async () => {
    const userObj = { username: "user1", password: "Plain Password" };
    const hashPass = "Hashed Password";
    bcrypt.hash.mockResolvedValue(hashPass);

    const updatedUserObj = await authRepo.hashPassword(userObj);

    expect(updatedUserObj.password).toBe(hashPass);
    expect(bcrypt.hash).toHaveBeenCalledWith("Plain Password", 10);
  })

  /*
    * Verifies the hash is correct
    * */
  it("should verify password matches hash", async () => {
    const hashedPass = "Hashed DB Password";
    const plainPass = "Plain Password";
    bcrypt.compare.mockResolvedValue(true);

    const isPassCorrect = await authRepo.verify(hashedPass, plainPass);

    expect(isPassCorrect).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      plainPass,
      hashedPass
    )

  })

  /*
    * Generates the User Token
    * */
  it("should generate a Token", async () => {
    const userObj = { pkey: "UUID", role: "Some role" }
    jwt.sign.mockImplementation((payload, secret, options) => {
      return "TOKEN STRING";
    })

    const token = await authRepo.generateToken(userObj);

    expect(token).toBe("TOKEN STRING");
    expect(jwt.sign).toHaveBeenCalledWith(
      userObj,
      "SECRET-KEY",
      expect.objectContaining({ expiresIn: expect.any(String) }),
    );
  });

  /*
    * Decodes the User Token 
    * */
  it("should decode a valid token", async () => {
    const authHeader = "Bearer SOME_TOKEN_STRING"
    jwt.verify.mockImplementation((text, hashed) => {
      return "DECODED TOKEN"
    })

    const actual = await authRepo.decodeToken(authHeader);

    expect(actual).toBe("DECODED TOKEN");
    expect(jwt.verify).toHaveBeenCalledWith(
      "SOME_TOKEN_STRING",
      "SECRET-KEY"
    );
  })

})



describe("Auth Service", () => {
  const AuthService = require("../../../src/modules/auth/auth.service.js")
  const { isValidPassword } = require("../../../src/utils/validator.js")

  jest.mock("../../../src/modules/auth/auth.dao.js")
  jest.mock("../../../src/utils/validator.js", () => ({
    isValidPassword: jest.fn()
  }))

  let authService, authRepositoryMock;
  beforeEach(() => {
    authRepositoryMock = {
      hashPassword: jest.fn(),
      verify: jest.fn(),
      generateToken: jest.fn(),
      decodeToken: jest.fn(),
    }
    authService = new AuthService(authRepositoryMock);
  })

  afterEach(() => {
    jest.resetAllMocks();
  })

  /*
    * Passing a valid user object
    * */
  it("should call dao's hashPassword", async () => {
    const user = { username: "user", password: "plain-text" }
    const updatedUser = { username: "user", password: "hashed-pass" };
    authRepositoryMock.hashPassword.mockResolvedValue(updatedUser);
    isValidPassword.mockReturnValue("hashed-pass");

    const returnedUser = await authService.hashPassword(user);

    expect(returnedUser).toEqual(updatedUser);
    expect(isValidPassword).toHaveBeenCalledWith(user.password);
    expect(authRepositoryMock.hashPassword).toHaveBeenCalledWith(user);
    expect(authRepositoryMock.hashPassword).toHaveBeenCalled();
  })

  /*
    * Passing an invalid user object
    * */
  it("should not call hashPassword because password is absent", async () => {
    const user = { username: "user" }

    const returnedUser = await authService.hashPassword(user);

    expect(returnedUser).toBeUndefined();
    expect(isValidPassword).not.toHaveBeenCalled();
    expect(authRepositoryMock.hashPassword).not.toHaveBeenCalled();
  })

  /*
    * Passing an invalid password in user
    * */
  it("should not call hashPassword because password is invalid", async () => {
    const user = { username: "user", password: 1 }
    isValidPassword.mockReturnValue(false);

    const returnedUser = await authService.hashPassword(user);

    expect(returnedUser).toBeUndefined();
    expect(isValidPassword).toHaveBeenCalledWith(user.password);
    expect(authRepositoryMock.hashPassword).not.toHaveBeenCalled();
  })

  /*
    * Passing a valid user will generate a valid token
    * */
  it("should call dao's generateToken", async () => {
    const generatedToken = "mocked-token";
    const user = { pkey: "mocked-1234-1234-123456781234", role: "user" };
    authRepositoryMock.generateToken.mockResolvedValue(generatedToken);

    const token = await authService.generateToken(user);

    expect(token).toBe(generatedToken);
    expect(authRepositoryMock.generateToken).toHaveBeenCalledWith(user)
  })

  /*
    * Validate password: valid password should return true
    * */
  it("should call dao's verify and return true", async () => {
    const dbUser = { password: "hashed-password" };
    const signInData = { password: "plain-password" };

    authRepositoryMock.verify.mockResolvedValue(true);

    const isValid = await authService.validatePassword(dbUser, signInData);

    expect(isValid).toBe(true);
    expect(authRepositoryMock.verify).toHaveBeenCalledWith(dbUser.password, signInData.password);
  });

  /*
    * Validate the password, incorrect password should return false
    * */
  it("should call dao's verify and return false", async () => {
    const dbUser = { password: "hashed-password" };
    const signInData = { password: "wrong-password" };

    authRepositoryMock.verify.mockResolvedValue(false);

    const isValid = await authService.validatePassword(dbUser, signInData);

    expect(isValid).toBe(false);
    expect(authRepositoryMock.verify).toHaveBeenCalledWith(dbUser.password, signInData.password);
  });

  /*
    * Decode the supplied token, should call dao's decodeToken
    * */
  it("should call dao's decodeToken", async () => {
    const authHeader = "Bearer some-token";
    const decodedUser = { pkey: "mocked-pkey", role: "user" };

    authRepositoryMock.decodeToken.mockResolvedValue(decodedUser);

    const result = await authService.decodeToken(authHeader);

    expect(result).toEqual(decodedUser);
    expect(authRepositoryMock.decodeToken).toHaveBeenCalledWith(authHeader);
  });
})



describe("Authentication Middleware", () => {
  const { authentication } = require("../../../src/modules/auth/auth.middleware.js");
  const { authService } = require("../../../src/utils/dependencies.js");
  jest.mock("../../../src/utils/dependencies.js", () => ({
    authService: {
      hashPassword: jest.fn(),
      validatePassword: jest.fn(),
      generateToken: jest.fn(),
      decodeToken: jest.fn(),
    }
  }))

  let req, res, next;
  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  })

  /*  
    * Auth header is missing 
    * */
  it("should return 403 if auth header is missing", async () => {
    await authentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unathorized" });
    expect(next).not.toHaveBeenCalled();
  })

  /*  
    * Auth token is invalid 
    * */
  it("should return 400 if token is invalid", async () => {
    req.headers.authorization = "Bearer InvalidToken"
    authService.decodeToken.mockResolvedValue(null);

    await authentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid Token" });
    expect(next).not.toHaveBeenCalled();
  })

  /*
    * Continues with valid token
    * */
  it("should call next if token is valid", async () => {
    req.headers.authorization = "Bearer validToken";
    authService.decodeToken.mockResolvedValue({ pkey: "mocked-1234-1234-123456781234", role: "user" });

    await authentication(req, res, next);

    expect(authService.decodeToken).toHaveBeenCalledWith("Bearer validToken");
    expect(req.user).toEqual({ pkey: "mocked-1234-1234-123456781234", role: "user" });
    expect(next).toHaveBeenCalled();
  })
})

describe("Authorization Middleware", () => {
  const { authorization } = require("../../../src/modules/auth/authz.middleware.js");
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  })

  /*  
    * Auth header user is missing 
    * */
  it("should return 403 if request user is missing", async () => {
    const roles = ["Valid Roles"];
    const middlewareFunc = authorization(roles);
    await middlewareFunc(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  })

  /*  
    * Auth req user role is invalid 
    * */
  it("should return 403 if user role is invalid", async () => {
    const roles = ["Valid Role"];
    req.user = { pkey: "user-pk", role: "Invalid Role" }

    const middlewareFunc = authorization(roles);
    await middlewareFunc(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  })

  /*
    * Continues with valid user
    * */
  it("should call next if token is valid", async () => {
    const roles = ["Valid Role"];
    req.user = { pkey: "user-pk", role: "Valid Role" }

    const middlewareFunc = authorization(roles);
    await middlewareFunc(req, res, next)

    expect(next).toHaveBeenCalled();
  })
})


describe("Auth Controller", () => {
  const request = require("supertest");
  const express = require("express");
  const AuthController = require("../../../src/modules/auth/auth.controller");

  let app, authServiceMock, userServiceMock, authController;

  beforeEach(() => {
    authServiceMock = {
      hashPassword: jest.fn(),
      generateToken: jest.fn(),
      validatePassword: jest.fn(),
    };

    userServiceMock = {
      create: jest.fn(),
      get: jest.fn(),
    };

    authController = new AuthController(authServiceMock, userServiceMock);
    app = express();
    app.use(express.json());
    app.use("/auth", authController.router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  /*
    * Register returns 400 if body is missing
    */
  it("should return 400 if request body is missing", async () => {
    const response = await request(app).post("/auth/register").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid Body" });
  });

  /*
    * Register returns 400 if password validation fails
    */
  it("should return 400 if password validation fails", async () => {
    authServiceMock.hashPassword.mockResolvedValue(undefined);
    const response = await request(app).post("/auth/register").send({ username: "test", password: "weak" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid Password" });
    expect(authServiceMock.hashPassword).toHaveBeenCalledWith({ username: "test", password: "weak" });
  });

  /*
    * Register returns 400 if user creation fails
    */
  it("should return 400 if user creation fails", async () => {
    authServiceMock.hashPassword.mockResolvedValue({ username: "test", password: "hashed" });
    userServiceMock.create.mockResolvedValue(undefined);

    const response = await request(app).post("/auth/register").send({ username: "test", password: "strongpass" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid User" });
  });

  /*
    * Register returns 400 if token generation fails
    */
  it("should return 400 if token generation fails", async () => {
    const createdUser = { username: "test", role: "user" };

    authServiceMock.hashPassword.mockResolvedValue(createdUser);
    userServiceMock.create.mockResolvedValue(createdUser);
    authServiceMock.generateToken.mockResolvedValue(undefined);

    const response = await request(app).post("/auth/register").send({ username: "test", password: "strongpass" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid Token" });
  });

  /*
    * Register: should return 201 if registration succeeds
    */
  it("should return 201 if registration succeeds", async () => {
    const createdUser = { username: "test", role: "user" };
    const token = "mocked-token";

    authServiceMock.hashPassword.mockResolvedValue(createdUser);
    userServiceMock.create.mockResolvedValue(createdUser);
    authServiceMock.generateToken.mockResolvedValue(token);

    const response = await request(app).post("/auth/register").send({ username: "test", password: "strongpass" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Successful account creation",
      user: { username: createdUser.username, role: createdUser.role },
      token: token,
    });
  });

  /*
    * Login: should return 400 if request body is missing
    */
  it("should return 400 if request body is missing", async () => {
    const response = await request(app).post("/auth/login").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid Object" });
  });

  /*
    * Login: should return 400 if user is not found
    */
  it("should return 400 if user is not found", async () => {
    userServiceMock.get.mockResolvedValue(undefined);
    const response = await request(app).post("/auth/login").send({ username: "test", password: "wrongpass" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid User" });
  });

  /*
    * Login: should return 401 if password validation fails
    */
  it("should return 401 if password validation fails", async () => {
    userServiceMock.get.mockResolvedValue({ username: "test", password: "hashed" });
    authServiceMock.validatePassword.mockResolvedValue(false);

    const response = await request(app).post("/auth/login").send({ username: "test", password: "wrongpass" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid Signin" });
  });

  /*
    * Login: should return 400 if token generation fails
    */
  it("should return 400 if token generation fails", async () => {
    userServiceMock.get.mockResolvedValue({ username: "test", password: "hashed" });
    authServiceMock.validatePassword.mockResolvedValue(true);
    authServiceMock.generateToken.mockResolvedValue(undefined);

    const response = await request(app).post("/auth/login").send({ username: "test", password: "correctpass" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid Token" });
  });

  /*
    * Login: should return 200 if login succeeds
    */
  it("should return 200 if login succeeds", async () => {
    const user = { username: "test", role: "user", password: "hashed" };
    const token = "mocked-token";

    userServiceMock.get.mockResolvedValue(user);
    authServiceMock.validatePassword.mockResolvedValue(true);
    authServiceMock.generateToken.mockResolvedValue(token);

    const response = await request(app).post("/auth/login").send({ username: "test", password: "correctpass" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successful sign in",
      user: { username: user.username, role: user.role },
      token: token,
    });
  });
});

