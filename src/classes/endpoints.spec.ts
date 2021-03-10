import { RotiroError } from '../errors';
import { createError, ErrorCodes } from '../errors/error-codes';
import { Endpoints } from './endpoints';

describe('classes/endpoints', () => {
  let endpoints: Endpoints;

  describe('getRoutePatterns', () => {
    beforeEach(() => {
      endpoints = new Endpoints();
    });

    it('Returns not names if no routes defined', () => {
      const result = endpoints.getRoutePatterns();
      expect(result).toEqual([]);
    });

    it('Returns one name and pattern for one route', () => {
      endpoints.add('ping', '/ping', ['GET']);

      const result = endpoints.getRoutePatterns();
      expect(result).toEqual([
        { routeName: 'ping', pattern: /^\/ping[\/#\?]?$/i }
      ]);
    });

    it('Returns two name and patterns for 2 routes', () => {
      endpoints.add('ping', '/ping', ['GET']);
      endpoints.add(
        'pong',
        '/pong/:id',
        ['GET'],
        [{ name: 'id', type: 'string' }]
      );
      const result = endpoints.getRoutePatterns();
      expect(result).toEqual([
        { routeName: 'ping', pattern: /^\/ping[\/#\?]?$/i },
        { routeName: 'pong', pattern: /^\/pong(?:\/([^\/#\?]+?))[\/#\?]?$/i }
      ]);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      endpoints = new Endpoints();
    });

    it('Should throw error if name not found', () => {
      let error: RotiroError | undefined;
      try {
        endpoints.get('ping');
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E101);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Should return an endpoint by name', () => {
      endpoints.add('ping', '/ping', ['GET']);
      const result = endpoints.get('ping');
      expect(result).toEqual({
        methods: {
          GET: {}
        },
        path: '/ping',
        pathParams: [],
        pattern: /^\/ping[\/#\?]?$/i,
        routeName: 'ping'
      });
    });
  });

  describe('Add Route', () => {
    beforeEach(() => {
      endpoints = new Endpoints();
    });

    it('Error if no route name', () => {
      let error: RotiroError | undefined;
      try {
        endpoints.add('', '/ping', ['GET']);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E108);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Error if parameters do not match schema', () => {
      let error: RotiroError | undefined;
      try {
        endpoints.add(
          'ping',
          '/ping/:id',
          ['GET'],
          [{ name: 'ids', type: 'string' }]
        );
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E110);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Error if route exists', () => {
      endpoints.add('Ping', '/ping', ['GET']);

      let error: RotiroError | undefined;
      try {
        endpoints.add('Ping', '/ping', ['GET']);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E109);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Error if no path', () => {
      let error: RotiroError | undefined;
      try {
        endpoints.add('Ping', '', ['GET']);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E111);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('Error if path exists', () => {
      endpoints.add('Ping', '/ping', ['GET']);

      let error: RotiroError | undefined;
      try {
        endpoints.add('Ping2', '/ping', ['GET']);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E112);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });

    it('should add a root endpoint with path /', () => {
      const result = endpoints.add('home', '/', ['GET']);
      expect(result).toBeTruthy();
    });

    it('should accept config against methods', () => {
      const result = endpoints.add('Ping', '/ping', {
        GET: { queryParams: [{ name: 'id', type: 'string' }] }
      });
      expect(result).toEqual({
        methods: { GET: { queryParams: [{ name: 'id', type: 'string' }] } },
        path: '/ping',
        pathParams: [],
        pattern: /^\/ping[\/#\?]?$/i,
        routeName: 'Ping'
      });
    });
  });

  describe('Locked behaviour', () => {
    beforeEach(() => {
      endpoints = new Endpoints();
    });

    it('Endpoints should not be locked initially', () => {
      expect(endpoints.locked).toEqual(false);
    });

    it('Should lock Endpoints', () => {
      endpoints.lock();
      expect(endpoints.locked).toEqual(true);
    });

    it('Should lock endpoint and prevent routes being added', () => {
      endpoints.lock();

      let error: RotiroError | undefined;
      try {
        endpoints.add('bob', '/bob', [], []);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.E105);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });
  });

  describe('getRoutesAndMethods', () => {
    beforeEach(() => {
      endpoints = new Endpoints();
    });

    it('Should return an empty list of routes and methods', () => {
      expect(endpoints.getRoutesAndMethods()).toEqual([]);
    });
    it('Should return list of routes and methods', () => {
      endpoints.add('users', '/users', ['GET', 'POST'], []);
      expect(endpoints.getRoutesAndMethods()).toEqual([
        {
          methods: ['GET', 'POST'],
          routeName: 'users'
        }
      ]);
    });
  });

  describe('getAuthTokenNames', () => {
    beforeEach(() => {
      endpoints = new Endpoints();
    });

    it('should return an empty list if no tokens', () => {
      endpoints.add('ping', '/ping', ['GET']);
      expect(endpoints.getAuthTokenNames()).toEqual([]);
    });

    it('should get list of token names associated with endpoints', () => {
      endpoints.add('ping', '/ping', { get: { auth: 'authToken' } });
      expect(endpoints.getAuthTokenNames()).toEqual(['authToken']);
    });

    it('should only return one token if duplicates found', () => {
      endpoints.add('ping', '/ping', { get: { auth: 'authToken' } });
      endpoints.add('ping1', '/ping1', { get: { auth: 'authToken' } });
      expect(endpoints.getAuthTokenNames()).toEqual(['authToken']);
    });

    it('should return multiple different tokens', () => {
      endpoints.add('ping', '/ping', { get: { auth: 'authToken' } });
      endpoints.add('ping1', '/ping1', { get: { auth: 'authToken1' } });
      expect(endpoints.getAuthTokenNames()).toEqual([
        'authToken',
        'authToken1'
      ]);
    });
  });
});
