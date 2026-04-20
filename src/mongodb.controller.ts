import * as mongoose from 'mongoose';
import * as express from 'express';
import { ControllerOption, GenericController } from '@3kles/3kles-corebe';
import { MongoDBService } from './mongodb.service';

export class MongoDBController<T = any> extends GenericController {

	protected model: mongoose.Model<T>;

	constructor(service: MongoDBService<T>, option?: ControllerOption) {
		super(service, option);

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
}
