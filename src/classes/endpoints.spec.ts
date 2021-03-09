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
      expect(() => {
        endpoints.get('ping');
      }).toThrow('Path not found');
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
      expect(() => {
        endpoints.add('', '/ping', ['GET']);
      }).toThrow('Invalid route name');
    });

    it('Error if parameters do not match schema', () => {
      expect(() => {
        endpoints.add(
          'ping',
          '/ping/:id',
          ['GET'],
          [{ name: 'ids', type: 'string' }]
        );
      }).toThrow('Path parameters do not match schema');
    });

    it('Error if route exists', () => {
      endpoints.add('Ping', '/ping', ['GET']);
      expect(() => {
        endpoints.add('Ping', '/ping', ['GET']);
      }).toThrow('Route name already added');
    });

    it('Error if no path', () => {
      expect(() => {
        endpoints.add('Ping', '', ['GET']);
      }).toThrow('Invalid path');
    });

    it('Error if path exists', () => {
      endpoints.add('Ping', '/ping', ['GET']);
      expect(() => {
        endpoints.add('Ping2', '/ping', ['GET']);
      }).toThrow('Path already added');
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
      expect(() => {
        endpoints.add('bob', '/bob', [], []);
      }).toThrow('Api is locked and cannot be updated');
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
