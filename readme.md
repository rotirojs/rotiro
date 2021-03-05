# Rotiro
Api schema middleware for Express

## Getting started

```bash
yarn install rotiro
```

or 

```bash
npm install rotiro
```

## Example usage

```javascript
const express = require("express");
const { Api } = require("rotiro");
const app = express();
const port = 3000;

// Create a new api
const api = new Api();

// Add a route to the api with a controller to handle the response
api.routes.add("ping", "/ping", {
  methods: {
    GET: {
      controller: apiRequest => {
        apiRequest.sendResponse(apiRequest, `Pong : ${Date.now()}`);
      }
    }
  }
});

// When all routes are added build the api
api.build();

// add the api as middleware to express
app.use(api.router());

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
```

Checkout the [rotiro-express-api](https://github.com/rotirojs/rotiro-express-api) router for a more detailed demo
