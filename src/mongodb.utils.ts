import { IAuth } from '@3kles/3kles-corebe';
import * as mongoose from 'mongoose';
import { MongoDBController } from './mongodb.controller';
import { MongoDBRouter } from './mongodb.router';
import { MongoDBSecureRouter } from './mongodb.secure.router';
import { MongoDBService } from './mongodb.service';

export class MongoDBUtils {
    public static buildRouterFromModel<T = any>(model: mongoose.Model<T>): MongoDBRouter {
        const service: MongoDBService<T> = new MongoDBService<T>(model);
        const controller: MongoDBController<T> = new MongoDBController<T>(service);
        return new MongoDBRouter<T>(controller);
    }

    public static buildSecureRouterFromModel<T = any>(model: mongoose.Model<T>, auth: IAuth): MongoDBRouter {
        const service: MongoDBService<T> = new MongoDBService<T>(model);
        const controller: MongoDBController<T> = new MongoDBController<T>(service);
        return new MongoDBSecureRouter<T>(auth, controller);
    }
}
