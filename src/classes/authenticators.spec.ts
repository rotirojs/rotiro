import { RotiroError } from '../errors';
import { createError, ErrorCodes } from '../errors/error-codes';
import { ApiRequest, AuthenticatorFunc } from '../type-defs';
import { Authenticators } from './authenticators';

describe('classes/authenticators', () => {
  const func: AuthenticatorFunc = async (req: ApiRequest) => {
    /* do nothing */
    return true;
  };

  let authenticators: Authenticators;

  describe('Locking', () => {
    beforeEach(() => {
      authenticators = new Authenticators();
    });

    it('Controllers should not be locked initially', () => {
      expect(authenticators.locked).toEqual(false);
    });

    it('Should lock controller', () => {
      authenticators.lock();
      expect(authenticators.locked).toEqual(true);
    });

    it('Should lock authenticator and prevent routes being added', () => {
      authenticators.lock();

      let error: RotiroError | undefined;
      try {
        authenticators.add('bob', func);
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
      authenticators = new Authenticators();
    });

    it('Should add and get authenticators', () => {
      authenticators.add('bob', func);
      expect(authenticators.get('bob')).toEqual(func);
    });

    it('Should add multiple tokens to a authenticators', () => {
      const func2: AuthenticatorFunc = async (req: ApiRequest) => {
        /* do nothing */
        return false;
      };
      authenticators.add('bob', func);
      authenticators.add('margret', func2);
      expect(authenticators.get('bob')).toEqual(func);
      expect(authenticators.get('margret')).toEqual(func2);
    });
  });

  describe('validateAuthenticators', () => {
    beforeEach(() => {
      authenticators = new Authenticators();
    });

    it('Return an empty list if not authenticators required', () => {
      expect(authenticators.validateAuthenticators([])).toEqual([]);
    });

    it('Return an empty list if authenticators matched', () => {
      authenticators.add('bob', func);
      expect(authenticators.validateAuthenticators(['bob'])).toEqual([]);
    });

    it('Return error if authenticator not matched', () => {
      authenticators.add('bob1', func);
      expect(authenticators.validateAuthenticators(['bob'])).toEqual([
        'bob has no handler registered'
      ]);
    });

    it('Return error if any authenticators not matched', () => {
      authenticators.add('bob', func);
      authenticators.add('bob1', func);
      expect(authenticators.validateAuthenticators(['bob', 'bob2'])).toEqual([
        'bob2 has no handler registered'
      ]);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      authenticators = new Authenticators();
    });

    it('Should throw error if no controller', () => {
      let error: RotiroError | undefined;
      try {
        authenticators.get('bob');
      } catch (ex) {
        error = ex;
      }
      expect(error).toEqual(createError(ErrorCodes.TokenNotSupported));
    });
  });
});
