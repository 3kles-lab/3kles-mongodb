import * as mongoose from 'mongoose';
import * as express from 'express';
import { GenericController } from '@3kles/3kles-corebe';
import { MongoDBService } from './mongodb.service';

export class MongoDBController extends GenericController {

	protected model: mongoose.Model<mongoose.Document>;

	constructor(service: MongoDBService) {
		super(service);

		this.model = service.model;
		this.execute.bind(this);
	}

	public getParameters(): any {
		const data = {
			model: this.model,
			modelname: this.model.modelName
		};
		return data;
	}

	public setResponseHeader(res: express.Response, response: { data: any, totalCount?: number }): void {
		if (response.totalCount) {
			res.setHeader('Total-Count', response.totalCount);
		} else if (response.data && Array.isArray(response.data)) {
			res.setHeader('Total-Count', response.data.length);
		}
	}

}
