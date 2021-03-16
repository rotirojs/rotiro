import { validateRequest } from './validate-request';

describe('utils/request-params/validate-request', () => {
  describe('validateRequest', () => {
    it('Return valid if no parameters required', () => {
      const result = validateRequest({}, {}, {});
      expect(result).toEqual(true);
    });

    it('Return valid if no parameters supplied', () => {
      const result = validateRequest(
        undefined as any,
        undefined as any,
        undefined as any
      );
      expect(result).toEqual(true);
    });

    it('Return false if a path parameter is not valid', () => {
      const result = validateRequest(
        {
          name: {
            valid: false
          }
        } as any,
        {},
        {}
      );
      expect(result).toEqual(false);
    });

    it('Return false if a body parameter is not valid', () => {
      const result = validateRequest(
        {},
        {
          name: {
            valid: false
          }
        } as any,
        {}
      );
      expect(result).toEqual(false);
    });

    it('Return false if a query parameter is not valid', () => {
      const result = validateRequest({}, {}, {
        name: {
          valid: false
        }
      } as any);
      expect(result).toEqual(false);
    });

    it('Return true if a path parameter is valid', () => {
      const result = validateRequest(
        {
          name: {
            valid: true
          }
        } as any,
        {},
        {}
      );
      expect(result).toEqual(true);
    });

    it('Return true if a body parameter is valid', () => {
      const result = validateRequest(
        {},
        {
          name: {
            valid: true
          }
        } as any,
        {}
      );
      expect(result).toEqual(true);
    });

    it('Return true if a query parameter is valid', () => {
      const result = validateRequest({}, {}, {
        name: {
          valid: true
        }
      } as any);
      expect(result).toEqual(true);
    });
  });
});
