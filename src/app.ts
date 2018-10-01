import { IM3Parameter } from './m3.interface';
import { M3App } from './m3.app';
import { M3Utils } from './m3.utils';

const parameters = {
	authentication: {
		host: "3kles-vm3.3kles.local",
		port: 40008,
		api: "MNS150MI",
		transaction: "GetUserData",
		inParameter: {}
	} as IM3Parameter,
	getlocation: {
		host: "3kles-vm3.3kles.local",
		port: 40008,
		api: "MMS060MI",
		transaction: "Get",
		user: "3KLES\\WHM3",
		password: "3Kles123",
		inParameter: {}
	} as IM3Parameter,
	listlocation: {
		host: "3kles-vm3.3kles.local",
		port: 40008,
		api: "MMS060MI",
		transaction: "List",
		user: "3KLES\\WHM3",
		password: "3Kles123",
		inParameter: {}
	} as IM3Parameter,
	updatelocation: {
		host: "3kles-vm3.3kles.local",
		port: 40008,
		api: "MMS175MI",
		transaction: "Update",
		user: "3KLES\\WHM3",
		password: "3Kles123",
		inParameter: {}
	} as IM3Parameter
};

const authParameter: IM3Parameter = parameters.authentication as IM3Parameter;

const listParameters: IM3Parameter[] = M3Utils.loadM3Config(parameters);

const app: M3App = new M3App(listParameters, authParameter);
app.startApp(40001);

const routes = [];
app.getRouter().router.stack.forEach((middleware) => {
	if (middleware.route) {
		routes.push(Object.keys(middleware.route.methods) + " -> " + middleware.route.path);
	}
});

console.log(JSON.stringify(routes, null, 4));
module.exports = app.getApp(); // For Mcha Testing
