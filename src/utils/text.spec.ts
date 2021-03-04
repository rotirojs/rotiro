import { trimString } from './index';

describe('utils/text', () => {
  describe('trimString', () => {
    it('Remove trailing space', () => {
      const srcText = 'This  ';
      expect(trimString(srcText)).toEqual('This');
    });

    it('Remove leading and trailing space', () => {
      const srcText = '  This  ';
      expect(trimString(srcText)).toEqual('This');
    });

    it('Remove leading space', () => {
      const srcText = '   This';
      expect(trimString(srcText)).toEqual('This');
    });

    it('Return empty string if nothing passed', () => {
      const srcText = null;
      expect(trimString(srcText)).toEqual('');
    });

    it('Not change string if no padding', () => {
      const srcText = 'This';
      expect(trimString(srcText)).toEqual('This');
    });
  });
});
