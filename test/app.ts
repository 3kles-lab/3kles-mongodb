import { MongoDBApp } from '../src/mongodb.app';
import { MongoDBUtils } from '../src/mongodb.utils';
import environmentSchema from './models/environment';
import configurationSchema from './models/configuration';
import m3userSchema from './models/m3user';
import userSchema from './models/user';

const app: MongoDBApp = new MongoDBApp('db');
const Environment = app.getMongoose().model<any>('environment', environmentSchema);
console.log('Environment=', Environment.collection.name);
const Configuration = app.getMongoose().model<any>('Configuration', configurationSchema);
const M3User = app.getMongoose().model<any>('M3User', m3userSchema);
const user = app.getMongoose().model<any>('users', userSchema);
app.addRoute(MongoDBUtils.buildRouterFromModel(user).router);
app.addRoute(MongoDBUtils.buildRouterFromModel(Environment).router);
app.addRoute(MongoDBUtils.buildRouterFromModel(Configuration).router);
app.addRoute(MongoDBUtils.buildRouterFromModel(M3User).router);
app.startApp(12100);

const routes = [];
app.getApp()._router.stack.forEach((m) => {
	if (m.route) {
		routes.push(Object.keys(m.route.methods) + " -> " + m.route.path);
	}
});

console.log(JSON.stringify(routes, null, 4));
module.exports = app.getApp(); // For Mocha Testing
