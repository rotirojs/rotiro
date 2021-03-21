import { RotiroError } from '../errors';
import { createError, ErrorCodes } from '../errors/error-codes';
import { RouteConfig } from '../type-defs';
import { Api } from './api';
import { Controllers } from './controllers';
import { Endpoints } from './endpoints';
import { Routes } from './routes';

describe('classes/routes', () => {
  let routes: Routes;
  let endPoints: Endpoints;
  let controllers: Controllers;

  beforeEach(() => {
    endPoints = new Endpoints();
    controllers = new Controllers();
    routes = new Routes(endPoints, controllers);
  });

  describe('lock', () => {
    it('Routes should not be locked initially', () => {
      expect(routes.locked).toEqual(false);
    });

    it('Should lock routes', () => {
      routes.lock();
      expect(routes.locked).toEqual(true);
    });

    it('Should lock the class and throw error if changed', () => {
      routes.lock();

      let error: RotiroError | undefined;
      try {
        routes.add('ping', '/ping', {} as any);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.ApiLocked);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });
  });

  describe('add route', () => {
    let api: Api;
    beforeEach(() => {
      api = new Api();
    });

    it('should add a route using a config', () => {
      const routeConfig: RouteConfig = {
        methods: {
          GET: {
            controller: jest.fn()
          }
        }
      };
      api.routes.add('ping', '/ping', routeConfig);
      api.build();
      expect(api.controllers.get('ping', 'GET')).toBeTruthy();
      expect(api.endpoints.get('ping')).toBeTruthy();
    });

    it('should add a route of / using a config', () => {
      const routeConfig: RouteConfig = {
        methods: {
          GET: {
            controller: jest.fn()
          }
        }
      };
      api.routes.add('home', '/', routeConfig);
      api.build();
      expect(api.controllers.get('home', 'GET')).toBeTruthy();
      expect(api.endpoints.get('home')).toBeTruthy();
    });

    it('should add a route with path parameters and return the correct payload', () => {
      const routeConfig: RouteConfig = {
        path: { id: 'string' },
        methods: {
          GET: {
            controller: jest.fn()
          }
        }
      };
      api.routes.add('ping', '/ping/:id', routeConfig);
      api.build();
      expect(api.controllers.get('ping', 'GET')).toBeTruthy();
      expect(api.endpoints.get('ping')).toEqual({
        methods: {
          GET: {}
        },
        path: '/ping/:id',
        pathParams: [
          {
            name: 'id',
            type: 'string'
          }
        ],
        pattern: /^\/ping(?:\/([^\/#\?]+?))[\/#\?]?$/i,
        routeName: 'ping'
      });
    });

    it('should add a route using a path object', () => {
      const routeConfig: RouteConfig = {
        path: { id: { type: 'string' } },
        methods: {
          GET: {
            controller: jest.fn()
          }
        }
      };
      api.routes.add('ping', '/ping/:id', routeConfig);
      api.build();
      expect(api.controllers.get('ping', 'GET')).toBeTruthy();
      expect(api.endpoints.get('ping')).toBeTruthy();
    });

    it('should throw an error if no methods found', () => {
      const routeConfig: RouteConfig = {
        path: { id: 'string' },
        methods: {}
      };

      let error: RotiroError | undefined;
      try {
        api.routes.add('ping', '/ping/:id', routeConfig);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.NoMethodsDefined);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('will assign an auth parameter to a method', () => {
      const routeConfig: RouteConfig = {
        path: { id: 'string' },
        methods: {
          GET: {
            auth: 'authToken',
            controller: jest.fn()
          }
        }
      };
      api.authenticators.add('authToken', jest.fn());
      api.routes.add('ping', '/ping/:id', routeConfig);
      api.build();
      const endpoint: any = api.endpoints.get('ping');
      expect(endpoint.methods.GET.auth).toEqual('authToken');
    });

    it('will assign an body to a method', () => {
      const routeConfig: RouteConfig = {
        path: { id: 'string' },
        methods: {
          POST: {
            controller: jest.fn(),
            body: { bob: { type: 'string' } }
          }
        }
      };
      api.routes.add('ping', '/ping/:id', routeConfig);
      api.build();
      const endpoint: any = api.endpoints.get('ping');
      expect(endpoint.methods.POST.bodyParams).toEqual([
        {
          name: 'bob',
          type: 'string'
        }
      ]);
    });

    it('will assign an query to a method', () => {
      const routeConfig: RouteConfig = {
        path: { id: 'string' },
        methods: {
          PATCH: {
            controller: jest.fn(),
            query: { bob: { type: 'string' } }
          }
        }
      };
      api.routes.add('ping', '/ping/:id', routeConfig);
      api.build();
      const endpoint: any = api.endpoints.get('ping');
      expect(endpoint.methods.PATCH.queryParams).toEqual([
        {
          name: 'bob',
          type: 'string'
        }
      ]);
    });
  });
});
