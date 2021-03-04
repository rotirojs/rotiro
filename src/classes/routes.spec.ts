import { ApiRequest, ControlerFunc, RouteConfig } from "../type-defs";
import { Api } from "./api";
import { Controllers } from "./controllers";
import { Endpoints } from "./endpoints";
import { Routes } from "./routes";

describe("classes/routes", () => {
  let routes: Routes;
  let endPoints: Endpoints;
  let controllers: Controllers;

  beforeEach(() => {
    endPoints = new Endpoints();
    controllers = new Controllers();
    routes = new Routes(endPoints, controllers);
  });

  describe("lock", () => {
    it("Routes should not be locked initially", () => {
      expect(routes.locked).toEqual(false);
    });

    it("Should lock routes", () => {
      routes.lock();
      expect(routes.locked).toEqual(true);
    });

    it("Should lock the class and throw error if changed", () => {
      routes.lock();
      expect(() => {
        routes.add("ping", "/ping", {} as any);
      }).toThrow("Api is locked and cannot be updated");
    });
  });

  describe("add route", () => {
    let api: Api;
    beforeEach(() => {
      api = Api.create();
    });
    it("should add a route using a config", () => {
      const func: ControlerFunc = (req: ApiRequest) => {
        /* do nothing */
      };

      const routeConfig: RouteConfig = {
        methods: {
          GET: {
            controller: jest.fn()
          }
        }
      };
      routes.add("ping", "/ping", routeConfig);
    });
  });
});
