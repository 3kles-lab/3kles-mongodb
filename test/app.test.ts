// test/app.test.ts
import request from 'supertest';
// Import MongoDBApp from the packaged library
import { MongoDBApp } from '@3kles/3kles-coremongodb'; // Replace 'your-lib' with the actual name of your library
import { MongoDBUtils } from '../src/mongodb.utils';
import { Model } from 'mongoose';
import userSchema from './models/user';

let server: any;

describe('Testing MongoDBApp from the library', () => {

	beforeAll(() => {
		const app = new MongoDBApp('db');
		const user: Model<any> = app.getMongoose().model<any>('users', userSchema);
		app.addRoute(MongoDBUtils.buildRouterFromModel(user).router);
		app.startApp(12100);
		server = app.getApp().listen();
	});

	afterAll(() => {
		// Close the server after tests
		server.close();
	});

	it('should respond with data on /users route', async () => {
		const response = await request(server).get('/db/users');
		expect(response.status).toBe(200); // Expect status 200
		expect(response.body).toBeInstanceOf(Array); // Expect response body to be an array
	});
	// Additional tests for other routes...
});
