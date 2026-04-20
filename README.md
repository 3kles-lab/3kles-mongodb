# @3kles/3kles-coremongodb

This package contains interface and class to create MongoDB Application

## App

**MongoDBApp** is a class that extends GenericApp from @3kles/3kles-corebe:
- **urlmongodb**: Set url to MongoDB
- **option**: Set connect options for mongoose

## Router

**MongoDBRouter** is a class to create a MongoDB router from a GenericRouter from @3kles/3kles-corebe

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
