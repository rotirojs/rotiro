import { RotiroError } from '../errors';
import { createError, ErrorCodes } from '../errors/error-codes';
import { ApiRequest, ControllerFunc } from '../type-defs';
import { Controllers } from './controllers';

describe('classes/controllers', () => {
  let controllers: Controllers;
  const func: ControllerFunc = (req: ApiRequest) => {
    /* do nothing */
  };

  beforeEach(() => {
    controllers = new Controllers();
  });

  describe('Locking', () => {
    beforeEach(() => {
      controllers = new Controllers();
    });

    it('Controllers should not be locked initially', () => {
      expect(controllers.locked).toEqual(false);
    });

    it('Should lock controller', () => {
      controllers.lock();
      expect(controllers.locked).toEqual(true);
    });

    it('Should lock controller and prevent routes being added', () => {
      controllers.lock();

      let error: RotiroError | undefined;
      try {
        controllers.add('bob', 'GET', func);
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.ApiLocked);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });
  });

  describe('Add', () => {
    beforeEach(() => {
      controllers = new Controllers();
    });

    it('Should add and get controllers', () => {
      controllers.add('bob', 'GET', func);
      expect(controllers.get('bob', 'GET')).toEqual(func);
    });

    it('Should add multiple methds to a  controllers', () => {
      const func2: ControllerFunc = (req: ApiRequest) => {
        /* do nothing */
      };
      controllers.add('bob', 'GET', func);
      controllers.add('bob', 'DELETE', func2);
      expect(controllers.get('bob', 'GET')).toEqual(func);
      expect(controllers.get('bob', 'DELETE')).toEqual(func2);
    });
  });

  describe('validateControllers', () => {
    beforeEach(() => {
      controllers = new Controllers();
    });

    it('Should return a list of endpoints without controllers', () => {
      const routes: Array<{ routeName: string; methods: string[] }> = [
        { routeName: 'bob', methods: ['GET', 'POST'] }
      ];
      expect(controllers.validateControllers(routes)).toEqual([
        'bob:GET',
        'bob:POST'
      ]);
    });

    it('Should return an empty list of endpoints if has controllers', () => {
      const routes: Array<{ routeName: string; methods: string[] }> = [
        { routeName: 'bob', methods: ['GET'] }
      ];
      controllers.add('bob', 'GET', func);
      expect(controllers.validateControllers(routes)).toEqual([]);
    });

    it('Should return errors if controller exists but method missing', () => {
      const routes: Array<{ routeName: string; methods: string[] }> = [
        { routeName: 'bob', methods: ['GET'] }
      ];
      controllers.add('bob', 'DELETE', func);
      expect(controllers.validateControllers(routes)).toEqual(['bob:GET']);
    });
  });
  describe('get', () => {
    beforeEach(() => {
      controllers = new Controllers();
    });

    it('Should throw error if no controller', () => {
      let error: RotiroError | undefined;
      try {
        controllers.get('bob', 'GET');
      } catch (ex) {
        error = ex;
      }

      const expectedError = createError(ErrorCodes.RouteNotSupported);
      expect((error as RotiroError).errorCode).toEqual(expectedError.errorCode);
      expect((error as RotiroError).message).toEqual(expectedError.message);
    });
  });
});
