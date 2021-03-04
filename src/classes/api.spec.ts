import { createRequest } from "../services/create-request";
import { AuthenticatorFunc } from "../type-defs";
import { Api } from "./api";
import { Controllers } from "./controllers";
import { Endpoints } from "./endpoints";
import { Mappers } from "./mappers";

// jest.mock("express", () => {
//   return { Request: { path: "/ping" }, Response: {} };
// });

describe("classes/api", () => {
  describe("create", () => {
    let api: Api;
    beforeEach(() => {
      api = Api.create();
    });

    it("Should create a new API instance", () => {
      expect(api.controllers).toBeInstanceOf(Controllers);
      expect(api.endpoints).toBeInstanceOf(Endpoints);
      expect(api.mappers).toBeInstanceOf(Mappers);
    });

    it("Should initially be unlocked", () => {
      expect(api.locked).toEqual(false);
    });
  });

  describe("build", () => {
    let api: Api;
    beforeEach(() => {
      api = Api.create();
    });

    it("should lock items on build", () => {
      api.build();
      expect(api.locked).toEqual(true);
      expect(api.controllers.locked).toEqual(true);
      expect(api.endpoints.locked).toEqual(true);
      expect(api.mappers.locked).toEqual(true);
    });

    it("Should throw an error if endpoint validation fails", () => {
      api.endpoints.add("bob", "/bob", ["GET"]);
      expect(() => {
        api.build();
      }).toThrow("Not all endpoints have a controller (bob:GET)");
    });

    it("Should throw error if endpoint auth not match a handler", () => {
      api.controllers.add("bob", "GET", jest.fn());
      api.endpoints.add("bob", "/bob", { GET: { auth: "authToken" } });
      expect(() => {
        api.build();
      }).toThrow(
        "One or more auth tokens to not have a handler (authToken has no handler registered)"
      );
    });
  });

  describe("router", () => {
    let api: Api;
    let request: any = null;
    let response: any = null;
    let middleware;
    beforeEach(() => {
      request = jest.fn();
      response = jest.fn();
      api = Api.create();
      middleware = api.router();
    });

    it("Should throw error if api not build", async () => {
      const error: any = new Error("Api not built");
      try {
        await middleware(request, response, undefined);
      } catch (ex) {
        expect(ex).toEqual(error);
      }

      // }).rejects().toEqual('Api not built');
    });

    it("Should throw an error if request is missing originalUrl", async () => {
      request.method = "GET";
      api.build();
      try {
        await middleware(request, response, undefined);
      } catch (ex) {
        expect(ex).toEqual(new Error("Original request not valid"));
      }
    });

    it("Should throw an error if request is missing method", async () => {
      request.originalUrl = "/ping";
      api.build();
      try {
        await middleware(request, response, undefined);
      } catch (ex) {
        expect(ex).toEqual(new Error("Original request not valid"));
      }
    });

    it("Should throw an error if request is missing all required params", async () => {
      api.build();
      try {
        await middleware(request, response, undefined);
      } catch (ex) {
        expect(ex).toEqual(new Error("Original request not valid"));
      }
    });

    it("Should should handle a get request", async () => {
      const func = jest.fn();
      request.method = "GET";
      request.originalUrl = "/ping";
      api.endpoints.add("ping", "/ping", ["GET"]);
      api.controllers.add("ping", "GET", func);
      api.build();
      await middleware(request, response, undefined);
      expect(func).toBeCalled();
    });

    it("Should should handle a get request with parameter", () => {
      const func = jest.fn();
      request.method = "GET";
      request.originalUrl = "/ping/bob";
      api.endpoints.add(
        "ping",
        "/ping/:id",
        ["GET"],
        [{ name: "id", type: "string" }]
      );
      api.controllers.add("ping", "GET", func);
      api.build();
      middleware(request, response, undefined);
      const calledWith: any = func.mock.calls[0][0];
      expect(calledWith.pathParams.id.value).toEqual("bob");
    });

    it("Should should error if path not found", async () => {
      const next = jest.fn();
      request.method = "GET";
      request.originalUrl = "/ping";
      api.build();
      try {
        await middleware(request, response, next);
      } catch (ex) {
        expect(ex).toEqual(new Error("Path not found"));
      }
    });
  });

  describe("Authentication", () => {
    let api: Api;
    let controllerFunc: any = null;
    let request: any = null;
    let response: any = null;
    let middleware;

    beforeEach(() => {
      controllerFunc = jest.fn();
      request = jest.fn();
      request.originalUrl = "/ping";
      request.method = "GET";
      response = jest.fn();
      api = Api.create();
      middleware = api.router();
      const authFunc: AuthenticatorFunc = async apiRequest => {
        return apiRequest.routeName === "ping";
      };

      api.authenticators.add("authToken", authFunc);
    });

    it("Should authenticate an endpoint request", async () => {
      api.endpoints.add("ping", "/ping", { GET: { auth: "authToken" } });
      api.controllers.add("ping", "GET", controllerFunc);
      api.build();
      const expressFunc = api.router();
      await expressFunc(request, response);

      const calledWith: any = controllerFunc.mock.calls[0][0];
      expect(calledWith.authenticated).toEqual(true);
    });

    it("Should return 401 status if not authenticated", async () => {
      api.endpoints.add("pingy", "/ping", { GET: { auth: "authToken" } });
      api.controllers.add("pingy", "GET", controllerFunc);
      api.build();
      const sendMock = jest.fn();
      response.status = jest.fn().mockReturnValue({
        send: sendMock
      });

      const expressFunc = api.router();
      await expressFunc(request, response);

      expect(response.status).toBeCalledWith(401);

      const calledWith: any = sendMock.mock.calls[0];
      expect(calledWith).toEqual([
        {
          message: "Unauthorized",
          statusCode: 401
        }
      ]);
    });
  });

  describe("Test base paths", () => {
    let api: Api;
    let request: any = null;
    let response: any = null;
    let middleware;
    beforeEach(() => {
      request = jest.fn();
      response = jest.fn();
      api = Api.create();
      middleware = api.router();
    });

    it("should process a route with a base path", async () => {
      const func = jest.fn();
      api = Api.create("api");
      api.endpoints.add("ping", "/ping", ["GET"]);
      api.controllers.add("ping", "GET", func);
      api.build();
      request = jest.fn();
      request.originalUrl = "/api/ping";
      request.method = "GET";
      const expressFunc = api.router();
      await expressFunc(request, response);
      expect(func).toBeCalled();
    });

    it("should fail a route without a base path", async () => {
      const func = jest.fn();
      api = Api.create("api");
      api.endpoints.add("ping", "/ping", ["GET"]);
      api.controllers.add("ping", "GET", func);
      api.build();
      request = jest.fn();
      request.originalUrl = "/ping";
      request.method = "GET";
      const expressFunc = api.router();
      try {
        await expressFunc(request, response);
      } catch (ex) {
        expect(ex).toEqual(new Error("Path not found"));
      }
    });
  });

  // describe('send response', () => {
  //   it('should send a response', () => {
  //     // Create an api request
  //
  //     const sendMock: any = jest.fn();
  //     const response: any = {};
  //     response.status = jest.fn().mockReturnValue({
  //       send: sendMock
  //     });
  //     response.type = jest.fn();
  //
  //     const controllerFunc: any = jest.fn();
  //     const api: Api = Api.create();
  //     api.endpoints.add('ping', '/ping', ['GET']);
  //     api.controllers.add('ping', 'GET', controllerFunc);
  //     api.build();
  //     const apiRequest = createRequest(
  //       '/ping',
  //       'GET',
  //       api.endpoints,
  //       api.mappers
  //     );
  //     apiRequest.response = response;
  //     const body: any = { name: 'bob' };
  //     api.sendResponse(apiRequest, body);
  //     expect(sendMock).toBeCalledWith(JSON.stringify(body));
  //   });
  // });

  describe("sendError", () => {
    let api: Api;
    let request: any = null;
    let response: any = null;
    let middleware;
    beforeEach(() => {
      request = jest.fn();
      response = jest.fn();
      api = Api.create();
      middleware = api.router();
    });

    it("Should should handle an error from controller", () => {
      const func = jest.fn();
      const sendMock = jest.fn();
      response.status = jest.fn().mockReturnValue({
        send: sendMock
      });

      const error = new Error("Controller Error");
      func.mockImplementation(() => {
        throw error;
      });
      request.method = "GET";
      request.originalUrl = "/ping";
      api.endpoints.add("ping", "/ping", ["GET"]);
      api.controllers.add("ping", "GET", func);
      api.build();
      middleware(request, response, undefined);
      expect(sendMock).toBeCalledWith({
        message: "Unknown error",
        statusCode: 500
      });
    });

    it("Should should handle a post request", () => {
      const func = jest.fn();
      request.method = "POST";
      request.originalUrl = "/ping";
      api.endpoints.add("ping", "/ping", {
        POST: { bodyParams: [{ name: "id", type: "string" }] }
      });
      api.controllers.add("ping", "POST", func);
      api.build();
      middleware(request, response, undefined);
      expect(func).toBeCalled();
    });
  });
});
