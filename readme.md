# Rotiro
An Api schema middleware for Express written in typescript

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


## What is Rotiro
Rotiro makes it easy to design well structured, testable APIs that may need to scale to many endpoints. It provides a number of features similar to those found in [Swagger middleware](https://github.com/apigee-127/swagger-tools/blob/master/docs/Middleware.md) however it is not intended as a replacement for Swagger.

Routes can be defined cleanly, paths use the same pattern as express and the specific configuration for each endpoint can be structured in a way that is easy to follow and maintain.

By configuring the API in code, testing is easy and most of your API tests are simple unit tests with limited need to mock libraries such as express.

Configuring endpoints is as simple as
```javascript
    api.routes.add('ping', '/ping', pingConfig);
    api.routes.add('users', '/users', usersConfig);
    api.routes.add('user', '/users/:id', userConfig);
```

## Features
* Rotiro separates the API definition from express, which makes it much easier to test and easier understand.
* Request body and query parameters can be mapped to objects using custom mappers (A custom mapper is a function that is registered against a data type e.g. Should you so wish, you could create a mapper that converts all parameters of type string to uppercase)
* Authentication can easily be added to any endpoint
* Content-type is automatically managed based on the type of data returned (Although this can be overridden)
* Errors are managed centrally, which makes it easier to create consistent responses.

## Who is it aimed at
Rotiro is designed to make larger APIs more manageable. The current solution works with express however the longer-term intention is to support other frameworks such as koa.

Since the Rotiro is written in typescript, it's an ideal choice for any existing typescript project.

## Why create Rotiro
I've been using Swagger for years to document APIs and then run them through express on top of the swagger middleware. I love the features that swagger middleware provides such as data mapping and support for authentication however I  found as my APIs grew, managing and generating the documents along with initialising the middleware to be more and more challenging. When you add typescript and other transpiling operations into the mix, it felt like time to create something that was more in line with my own workflow.

By configuring the API in code, it's easy to test and the longer-term plan is to enable the output of a swagger formatted document, which can be used with services such as Swagger UI. At that point, you'll get both a highly testable and easy to use API along with all the documentation and testing features provided via tools like SwaggerUI.

## What's Next
The architecture for Rotiro is still new and being refactored to make it easier to use, which means I may introduce some breaking changes.

Once the class interface is stable I'll start adding some better documentation.

In the meantime, I'm creating some more repositories with examples of how to integrate Rotiro with express.
