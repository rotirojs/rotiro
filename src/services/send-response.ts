import { ApiRequest } from "../type-defs";

export function sendResponse(
  apiRequest: ApiRequest,
  body: any,
  status: number = 200,
  contentType?: string
) {
  if (body === null || typeof body === "undefined") {
    body = "";
  }

  if (typeof body === "object") {
    try {
      const jsonBody: string = JSON.stringify(body);
      apiRequest.response.type(contentType || "application/json");
      apiRequest.response.status(status).send(jsonBody);
    } catch (ex) {
      apiRequest.response.type(contentType || "text/plain");
      apiRequest.response.status(500).send("Error parsing object");
    }
  } else if (typeof body === "string") {
    if (!contentType && body.includes("<html")) {
      contentType = "text/html";
    }
    apiRequest.response.type(contentType || "text/plain");
    apiRequest.response.status(status).send(body);
  } else {
    apiRequest.response.type(contentType || "text/plain");
    apiRequest.response.status(status).send(String(body));
  }
}
