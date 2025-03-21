
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-9148-4bac-ad54-c301aac94cdf"),
  validate: jest.fn((uuid) => {
    const regex = /^mocked-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
  })
}));

describe("User Model", () => {
  const { User } = require("../../../src/modules/user/user.model.js");

  /*
    * Create a new user object
    * */
  it("should get a new user", async () => {
    const userObject = {
      username: "user1",
      password: "password1"
    }
    const expected = {
      pkey: "mocked-9148-4bac-ad54-c301aac94cdf",
      role: "employee",
      username: "user1",
      password: "password1"
    }
    const actual = new User(userObject);
    expect(actual).toEqual(expected);
  })

})

describe("User Service", () => {
  let UserService = require("../../../src/modules/user/user.service.js")

  /*
    * Get a user via valid lookup object
    * */
  it("should get a valid pkey", async () => {
    const lookupObjects = [
      {
        pkey: "mocked-5f6a-43b2-a9dc-a92a51c423d4"
      },
      {
        username: "user1"
      },
    ]

    const expected = {
      pkey: "mocked-5f6a-43b2-a9dc-a92a51c423d4",
      role: "employee",
      username: "user1",
      password: "password1"
    }

    const mockDao = {
      get: (_) => { return expected; }
    }

    const userService = new UserService(mockDao);
    for (const lo of lookupObjects) {
      const actual = await userService.get(lo);
      expect(actual).toBe(expected);
    }
  })

  /*
    * A valid object will have a pkey, and not be undefined. 
    * */
  it("should return undefined because there's no valid lookup object", async () => {
    const lookupObjects = [
      {},
      { pkey: "NOT_A_VALID_UUID" },
      { pkey: undefined },
      { pkey: null },
      { pkey: true },
      { pkey: 1 },
      { pkey: 1.189 },
      { pkey: {} },
      { pkey: [] },
      { username: "/invalid" },
      { username: "!invalid" },
      { username: "#invalid" },
      { username: "?invalid" },
      { username: ".invalid" },
      { username: "@invalid" },
      { username: "$invalid" },
      { username: "%invalid" },
      { username: "^invalid" },
      { username: "&invalid" },
      { username: "*invalid" },
      { username: "(invalid" },
      { username: ")invalid" },
      { username: "=invalid" },
      { username: "+invalid" },
      { username: "\\invalid" },
      { username: "[invalid" },
      { username: "]invalid" },
      { username: "|invalid" },
      { username: '"invalid' },
      { username: "'invalid" },
      { username: "<invalid" },
      { username: ">invalid" },
      { username: ",invalid" },
      { username: undefined },
      { username: null },
      { username: true },
      { username: 1 },
      { username: 1.189 },
      { username: {} },
      { username: [] },
    ];
    const expected = undefined;
    const mockDao = {
      get: (_) => { console.log("Should not trigger; Invalid User Object: ", _); return 1; }
    };
    const userService = new UserService(mockDao);
    for (const lo of lookupObjects) {
      const actual = await userService.get(lo);
      expect(actual).toBe(expected);
    }
  })

  /*
    * Read all the users; This should always work because there is
    * */
  it("should read all the users provided", async () => {
    const lookupObject = {}

    const expected = [
      {
        pkey: "199df500-5f6a-43b2-a9dc-a92a51c423d4",
        role: "employee",
        username: "user1",
        password: "user1"
      },
      {
        pkey: "dacff986-50a5-4281-97cf-5f13c6c9bf63",
        role: "manager",
        username: "admin1",
        password: "admin1"
      }
    ]

    const mockDao = {
      read: (_) => { return expected; }
    }

    const userService = new UserService(mockDao);
    const actual = await userService.read(lookupObject);
    expect(actual).toBe(expected);
  })

  /*
    * validates the user object; returns the created user.
    *
    * */
  it("should create a user", async () => {
    const postUserObject = {
      username: "user",
      password: "password"
    }
    const expected = {
      pkey: "mocked-9148-4bac-ad54-c301aac94cdf",
      username: "user",
      password: "password",
    }
    const mockDao = {
      get: (_) => { return undefined; },
      create: (_) => { return expected; }
    }
    const userService = new UserService(mockDao);
    const actual = await userService.create(postUserObject);
    expect(actual).toBe(expected);
  })
  /*
    * if user exist it shouldn't return anything
    *
    * */
  it("should not create a user", async () => {
    const postUserObject = {
      username: "user",
      password: "password"
    }
    const expected = undefined;
    const mockDao = {
      get: (_) => { return true; },
      create: (_) => { return expected; }
    }
    const userService = new UserService(mockDao);
    const actual = await userService.create(postUserObject);
    expect(actual).toBe(expected);
  })

  /*
    * Updating a User from an employee.
    * */
  it("Updating A User", async () => {
    const lookupObject = {
      pkey: "mocked-9148-4bac-ad54-c301aac94cdf",
    };

    const updateObjects = [
      {
        property: "role",
        value: "manager"
      },
    ]

    const expected = {
      pkey: "mocked-9148-4bac-ad54-c301aac94cdf",
      username: "user1",
      password: "user1",
      role: "manager",
    }

    const mockDao = {
      get: (_) => {
        return true;
      },
      update: (_, __) => {
        return expected;
      }
    }

    const userService = new UserService(mockDao);
    const actual = await userService.update(lookupObject, updateObjects);
    expect(actual).toBe(expected);
  })

  /*
    * The lookup object pkey is incorrect
    * */
  it("should not update object due to invalid pkey", async () => {
    const lookupObject = {
      pkey: "mocked",
    };

    const expected = undefined;
    const userService = new UserService({});
    const actual = await userService.update(lookupObject, {});
    expect(actual).toBe(expected);
  })


  /*
    * Not supported.
    * Shouldn't delete the user.
    * */
  it("Delete A User", () => {
    expect(true).toBe(true);
  })


})

