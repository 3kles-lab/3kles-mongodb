# @3kles/3kles-coremongodb

This package contains interface and class to create MongoDB Application

## App

**MongoDBApp** is a class that extends GenericApp from @3kles/3kles-corebe:
- **urlmongodb**: Set url to MongoDB
- **option**: Set connect options for mongoose

## Router

**MongoDBRouter** is a class to create a MongoDB router from a GenericRouter from @3kles/3kles-corebe

The router uses JSON/form parsing by default. `parser: false` or a selected
`parser` middleware can be passed in the same options argument as `mergeParams`.
The model-scoped parser is installed before inherited validators and CRUD routes;
services extending MongoDBRouter do not need to add parsing middleware. No parser
is installed globally by GenericApp. This requires the matching router-owned
parsing changes in corebe before publishing this library.

## Controller

**MongoDBController** is a class to create a MongoDBController that extends from AbstractGenericController from @3kles/3kles-corebe

- **model**: Define the model of document we store

## Service

**MongoDBService** is a service that extends from AbstractGenericService from @3kles/3kles-corebe to do CRUD operations

## Install

### npm

```
npm install @3kles/3kles-coremongodb --save
```

## How to use

How to create an app

```javascript
const port = 30000;
const httpjsonapi: HttpApi = new HttpApi();
httpjsonapi.setResponseParser(new JSONParser());
httpjsonapi.setErrorParser(new JSONParser());

const documents = app.getMongoose().model<any>('documents', documentSchema);
app.addRoute(new MongoDBRouter(new MongoDBController(new MongoDBService(documents, httpjsonapi))).router);

app.initRoute();

app.startApp(port);
```

Check the [`documentation`](https://doc.3kles-consulting.com) here.
