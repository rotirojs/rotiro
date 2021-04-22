import { ApiResponse } from '../type-defs';
import { getResponseDetail } from './get-response-detail';

describe('services/send-response', () => {
  describe('getResponseDetail', () => {
    it('Should return a plain text message', () => {
      const response: ApiResponse = getResponseDetail('Hello World');
      expect(response.statusCode).toEqual(200);
      expect(response.contentType).toEqual('text/plain');
      expect(response.body).toEqual('Hello World');
    });

    it('Should return a number as plain text message', () => {
      const response: ApiResponse = getResponseDetail(42);
      expect(response.statusCode).toEqual(200);
      expect(response.contentType).toEqual('text/plain');
      expect(response.body).toEqual(42);
    });

    it('Should return html', () => {
      const body: string = `<html lang="en"><body>Hello World</body></html>`;

      const response: ApiResponse = getResponseDetail(body);
      expect(response.statusCode).toEqual(200);
      expect(response.contentType).toEqual('text/html');
      expect(response.body).toEqual(body);
    });

    it('Should return an object', () => {
      const content: any = {
        name: 'bob'
      };

      const response: ApiResponse = getResponseDetail(content);
      expect(response.statusCode).toEqual(200);
      expect(response.contentType).toEqual('application/json');
      expect(response.body).toEqual(JSON.stringify(content));
    });

    it('Should override a content type', () => {
      const content: any = {
        name: 'bob'
      };
      const response: ApiResponse = getResponseDetail(
        content,
        200,
        'text/plain'
      );
      expect(response.statusCode).toEqual(200);
      expect(response.contentType).toEqual('text/plain');
      expect(response.body).toEqual(JSON.stringify(content));
    });

    it('Should return a custom status', () => {
      const content: any = { name: 'bob' };
      const response: ApiResponse = getResponseDetail(content, 201);
      expect(response.statusCode).toEqual(201);
      expect(response.contentType).toEqual('application/json');
      expect(response.body).toEqual(JSON.stringify(content));
    });

    it('Should handle null body', () => {
      const response: ApiResponse = getResponseDetail(null, 200);
      expect(response.statusCode).toEqual(200);
      expect(response.contentType).toEqual('text/plain');
      expect(response.body).toEqual('');
    });

    it('Should handle undefined body', () => {
      const response: ApiResponse = getResponseDetail(undefined, 200);
      expect(response.statusCode).toEqual(200);
      expect(response.contentType).toEqual('text/plain');
      expect(response.body).toEqual('');
    });

    it('Should return an error on json parse fail', () => {
      const content: any = {
        name: 'bob'
      };
      content.name = content;

      const response: ApiResponse = getResponseDetail(content, 200);
      expect(response.statusCode).toEqual(500);
      expect(response.contentType).toEqual('text/plain');
      expect(response.body).toEqual('Error parsing object');
    });

    it('Should update missing content type with header', () => {
      const content: any = { name: 'bob' };
      const response: ApiResponse = getResponseDetail(content, 200, '', {
        'Content-Type': 'some/media'
      });

      expect(response.contentType).toEqual('some/media');
    });

    it('Should not update existing content type with header', () => {
      const content: any = { name: 'bob' };
      const response: ApiResponse = getResponseDetail(
        content,
        200,
        'selected/media',
        { contentType: 'some/media' }
      );

      expect(response.contentType).toEqual('selected/media');
    });
  });
});
