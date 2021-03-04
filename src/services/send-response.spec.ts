import { sendResponse } from './send-response';

describe('services/send-response', () => {
  describe('sendResponse', () => {
    let sendMock: any;
    let response: any;
    let apiRequest: any;

    beforeEach(() => {
      sendMock = jest.fn();
      response = {};
      response.status = jest.fn().mockReturnValue({
        send: sendMock
      });
      response.type = jest.fn();
      apiRequest = { response };
    });

    it('Should return a plain text message', () => {
      sendResponse(apiRequest, 'Hello World');
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(200);
      expect(response.type).toBeCalledWith('text/plain');
      expect(sendMock).toBeCalledWith('Hello World');
    });

    it('Should return a number as plain text message', () => {
      sendResponse(apiRequest, 42);
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(200);
      expect(response.type).toBeCalledWith('text/plain');
      expect(sendMock).toBeCalledWith('42');
    });

    it('Should return html', () => {
      const body: string = `<html lang="en"><body>Hello World</body></html>`;
      sendResponse(apiRequest, body);
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(200);
      expect(response.type).toBeCalledWith('text/html');
      expect(sendMock).toBeCalledWith(body);
    });

    it('Should return an object', () => {
      const content: any = { name: 'bob' };
      sendResponse(apiRequest, content);
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(200);
      expect(response.type).toBeCalledWith('application/json');
      expect(sendMock).toBeCalledWith(JSON.stringify(content));
    });

    it('Should override a content type', () => {
      const content: any = { name: 'bob' };
      sendResponse(apiRequest, content, 200, 'text/plain');
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(200);
      expect(response.type).toBeCalledWith('text/plain');
      expect(sendMock).toBeCalledWith(JSON.stringify(content));
    });

    it('Should return a custom status', () => {
      const content: any = { name: 'bob' };
      sendResponse(apiRequest, content, 201);
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(201);
      expect(response.type).toBeCalledWith('application/json');
      expect(sendMock).toBeCalledWith(JSON.stringify(content));
    });

    it('Should handle null body', () => {
      sendResponse(apiRequest, null);
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(200);
      expect(response.type).toBeCalledWith('text/plain');
      expect(sendMock).toBeCalledWith('');
    });

    it('Should handle undefined body', () => {
      sendResponse(apiRequest, null);
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(200);
      expect(response.type).toBeCalledWith('text/plain');
      expect(sendMock).toBeCalledWith('');
    });

    it('Should return an error on json parse fail', () => {
      const content: any = { name: 'bob' };
      content.name = content;
      sendResponse(apiRequest, content);
      const status: any = response.status.mock.calls[0][0];
      expect(status).toEqual(500);
      expect(response.type).toBeCalledWith('text/plain');
      expect(sendMock).toBeCalledWith('Error parsing object');
    });
  });
});
