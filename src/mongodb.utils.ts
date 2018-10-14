import * as mongoose from 'mongoose';
import { MongoDBController } from "./mongodb.controller";
import { MongoDBRouter } from "./mongodb.router";
import { MongoDBService } from "./mongodb.service";

export class MongoDBUtils {

	public static buildRouterFromModel(model: mongoose.Model<mongoose.Document>): MongoDBRouter {
		const service: MongoDBService = new MongoDBService(model);
		const controller: MongoDBController = new MongoDBController(service);
		return new MongoDBRouter(controller);
	}
}
