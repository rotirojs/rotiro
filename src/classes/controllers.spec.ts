import { ApiRequest, ControlerFunc } from '../type-defs';
import { Controllers } from './controllers';

describe('classes/controllers', () => {
  let controllers: Controllers;
  const func: ControlerFunc = (req: ApiRequest) => {
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
      expect(() => {
        controllers.add('bob', 'GET', func);
      }).toThrow('Api is locked and cannot be updated');
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
      const func2: ControlerFunc = (req: ApiRequest) => {
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
      expect(() => controllers.get('bob', 'GET')).toThrow(
        'Route not supported'
      );
    });
  });
});
