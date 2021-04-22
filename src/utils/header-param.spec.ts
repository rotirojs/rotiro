import { extractHeaderParam } from './header-param';

describe('utils/header-param', () => {
  describe('extractHeaderParam', () => {
    it('Return a header value with a different case key', () => {
      const headers: Record<string, string | string[]> = {
        'Content-type': 'text/plain'
      };
      expect(extractHeaderParam('CONTENT-TYPE', headers)).toEqual('text/plain');
    });
    it('Return an empty string if key not found', () => {
      const headers: Record<string, string | string[]> = {
        Contenttype: 'text/plain'
      };
      expect(extractHeaderParam('CONTENT-TYPE', headers)).toEqual('');
    });

    it('Return an empty string if headers not defined', () => {
      expect(extractHeaderParam('CONTENT-TYPE', undefined as any)).toEqual('');
    });

    it('Return an empty string if headers is an empty object', () => {
      expect(extractHeaderParam('CONTENT-TYPE', {})).toEqual('');
    });
  });
});
