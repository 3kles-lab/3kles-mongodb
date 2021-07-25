import { IAuth } from '3kles-corebe';
import * as mongoose from 'mongoose';
import { MongoDBController } from "./mongodb.controller";
import { MongoDBRouter } from "./mongodb.router";
import { MongoDBSecureRouter } from './mongodb.secure.router';
import { MongoDBService } from "./mongodb.service";

export class MongoDBUtils {

	public static buildRouterFromModel(model: mongoose.Model<mongoose.Document>): MongoDBRouter {
		const service: MongoDBService = new MongoDBService(model);
		const controller: MongoDBController = new MongoDBController(service);
		return new MongoDBRouter(controller);
	}

	public static buildSecureRouterFromModel(model: mongoose.Model<mongoose.Document>, auth: IAuth): MongoDBRouter {
		const service: MongoDBService = new MongoDBService(model);
		const controller: MongoDBController = new MongoDBController(service);
		return new MongoDBSecureRouter(auth, controller);
	}
}
