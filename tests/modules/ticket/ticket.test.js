
describe("Ticket Model", () => {
  jest.mock("uuid", () => ({
    v4: jest.fn(() => "mocked-9148-4bac-ad54-c301aac94cdf"),
    validate: jest.fn((uuid) => {
      const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      return regex.test(uuid);
    })
  }));
  const { Ticket } = require("../../../src/modules/ticket/ticket.model.js")

  /*
    * Constructor for a ticket
    * */
  it("should produce a ticket", () => {
    const minimumFields = {
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd",
      amount: 2.99,
      description: "some test description"
    }

    const expected = {
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd",
      amount: 2.99,
      description: "some test description",

      pkey: "mocked-9148-4bac-ad54-c301aac94cdf",
      status: "pending",
      type: "reimbursement",
      processor: null
    }

    const actual = new Ticket(minimumFields);

    expect(actual).toEqual(expected);
  })
})

describe("Ticket Service", () => {
  const TicketService = require("../../../src/modules/ticket/ticket.service")

  /*
    * Passing a valid lookup will return a valid ticket
    * */
  it("should get a valid ticket", async () => {

    const lookupObject = {
      pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
    };

    const expected = {
      pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
      status: "pending",
      type: "reimbursement",
      processor: null,

      amount: 1.00,
      description: "some test description",
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
    }

    const mockDao = {
      get: (lookupObject) => { return expected; },
    }

    const ticketService = new TicketService(mockDao);
    const actual = await ticketService.get(lookupObject);

    expect(actual).toBe(expected);

  })

  /*
    * Passing a invalid lookup will return undefined
    * */
  it("should get an undefined", async () => {
    const lookupObject = {};
    const expected = undefined
    const ticketService = new TicketService({});

    const actual = await ticketService.get(lookupObject);

    expect(actual).toBe(expected);
  })

  /*
    * Passing a valid ticket will return a valid ticket
    * */
  it("should post a valid ticket", async () => {

    const ticketObject = {
      amount: 1.00,
      description: "some test description",
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
    };

    const expected = {
      pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
      status: "pending",
      type: "reimbursement",
      processor: null,

      amount: 1.00,
      description: "some test description",
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
    }

    const mockDao = {
      create: (ticketObject) => { return expected; }
    }

    const ticketService = new TicketService(mockDao);
    const actual = await ticketService.create(ticketObject);

    expect(actual).toBe(expected);
  })

  /*
    * Passing an invalid ticket should return undefined
    * */
  it("should not post ticket and return undefined", async () => {

    const invalidTicketObjects = [
      //*---- Amount ----*//

      // amount is zero
      { amount: 0.00, description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { amount: 0, description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },

      // amount is negative
      { amount: -20, description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },

      // amount is incorrect type
      { amount: "1.00", description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { amount: "some test description", description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { amount: true, description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { amount: null, description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { amount: [], description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { amount: {}, description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },

      // amount is missing 
      { description: "some test description", owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },

      //*---- Description ----*//

      // description is blank
      { description: "", amount: 1.0, owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },

      // description is incorrect type
      { description: 1.0, amount: 1.0, owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { description: true, amount: 1.0, owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { description: null, amount: 1.0, owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { description: [], amount: 1.0, owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },
      { description: {}, amount: 1.0, owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },

      // description is missing
      { amount: 1.0, owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd" },

      //*---- Owner ----*//

      // owner is blank
      { amount: 1.0, description: "some test description", owner: "" },

      // owner is incorrect type
      { owner: 1, amount: 1.0, description: "some test description" },
      { owner: 1.99, amount: 1.0, description: "some test description" },
      { owner: true, amount: 1.0, description: "some test description" },
      { owner: null, amount: 1.0, description: "some test description" },
      { owner: [], amount: 1.0, description: "some test description" },
      { owner: {}, amount: 1.0, description: "some test description" },

      // owner is missing
      { amount: 1.0, description: "some test description" },

    ]

    const expected = undefined;
    const ticketService = new TicketService({
      create: (ticketObj) => {
        return console.log("should not trigger: ", ticketObj), 1;
      }
    });

    for (const ticketObject of invalidTicketObjects) {
      const ticket = await ticketService.create(ticketObject);
      expect(ticket).toBe(expected);
    }
  })

  /*
    * Should do nothing. Return undefined.
    * */
  it("should not delete the ticket", async () => {
    const lookupObject = {};
    const ticketService = new TicketService({});

    const expected = undefined
    const actual = await ticketService.delete(lookupObject);

    expect(actual).toBe(expected);
  })

  /*
    * Providing a valid lookup and update objects, should update the ticket
    * accordingly
    * */
  it("should update the ticket", async () => {
    const lookupObject = {
      pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
    }

    const updateObjects = [
      {
        property: "status",
        value: "approved",
      },
      {
        property: "processor",
        value: "42c0099d-191a-40ec-b553-aae4043711fd",
      },
    ];

    const toModify = {
      status: "pending",
      processor: null,

      pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
      type: "reimbursement",
      amount: 1.00,
      description: "some test description",
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
    }

    const expected = {
      status: "approved",
      processor: "42c0099d-191a-40ec-b553-aae4043711fd",

      pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
      type: "reimbursement",
      amount: 1.00,
      description: "some test description",
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
    }
    const mockDao = {
      get: (lookupObject) => { return toModify; },
      update: (lookupObject, updateObjects) => { return expected; }
    }

    const ticketService = new TicketService(mockDao);
    const actual = await ticketService.update(lookupObject, updateObjects);

    expect(actual).toBe(expected);
  })

  /*
    * Don't process an already processed ticket.
    * */
  it("should not update a processed ticket", async () => {
    const lookupObject = {
      pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
    }

    const updateObjects = [
      {
        property: "status",
        value: "denied",
      },
      {
        property: "processor",
        value: "ebf8d49d-acd1-4a51-9b17-a62dfeb880c4",
      },
    ];

    const toModify = {
      status: "approved",
      processor: "42c0099d-191a-40ec-b553-aae4043711fd",

      pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
      type: "reimbursement",
      amount: 1.00,
      description: "some test description",
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
    }

    const mockDao = {
      get: (lookupObject) => { return toModify; },
    }

    const ticketService = new TicketService(mockDao);
    const expected = undefined;
    const actual = await ticketService.update(lookupObject, updateObjects);

    expect(actual).toBe(expected);
  })

  /*
    * Gathers all tickets from the owner 
    * */
  it("should get a read all owner's tickets", async () => {

    const lookupObject = {
      owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
    };

    const expected = [
      {
        pkey: "5d28157b-9148-4bac-ad54-c301aac94cdf",
        status: "pending",
        type: "reimbursement",
        processor: null,

        amount: 1.00,
        description: "Item 1 test",
        owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
      },

      {
        pkey: "834b6a7e-2604-4c07-92c8-4cc5d1a30e8d",
        status: "approved",
        type: "reimbursement",
        processor: null,

        amount: 4.99,
        description: "Item 2 test",
        owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
      },

      {
        pkey: "651b5df2-7e5e-4c10-9ab1-7dc1f2657e23",
        status: "denied",
        type: "reimbursement",
        processor: null,

        amount: 6.80,
        description: "Item 3 test",
        owner: "11c38f1e-2d9d-4f3e-80f4-dd99c4fa78dd"
      },
    ]

    const mockDao = {
      read: (lookupObject) => { return expected; }
    }

    const ticketService = new TicketService(mockDao);
    const actual = await ticketService.read(lookupObject);

    expect(actual).toBe(expected);
  })

  /*
    * The lookup Object is invalid
    * */
  it("should return undefined because missing required value", async () => {

    const lookupObject = {};
    const expected = undefined;
    const mockDao = {
      read: (lookupObject) => { console.log("This shouldn't trigger"); }
    }

    const ticketService = new TicketService(mockDao);
    const actual = await ticketService.read(lookupObject);

    expect(actual).toBe(expected);
  })

  /*
    * The status field is incorrect.
    * */
  it("should return undefined because status field is invalid", async () => {

    const lookupObject = { status: "not valid" };
    const expected = undefined;
    const mockDao = {
      read: (lookupObject) => { console.log("This shouldn't trigger"); }
    }

    const ticketService = new TicketService(mockDao);
    const actual = await ticketService.read(lookupObject);

    expect(actual).toBe(expected);
  })

  /*
    * The status owner is incorrect.
    * */
  it("should return undefined because owner field is invalid", async () => {
    jest.mock("uuid", () => ({
      v4: jest.fn(() => "mocked-9148-4bac-ad54-c301aac94cdf"),
      validate: jest.fn(() => true) // This might be an issue when testing 
    }));

    const lookupObject = { owner: "Not valid" };
    const expected = undefined;
    const mockDao = {
      read: (lookupObject) => { console.log("This shouldn't trigger"); return 1; }
    }

    const ticketService = new TicketService(mockDao);
    const actual = await ticketService.read(lookupObject);

    expect(actual).toBe(expected);
  })


})

