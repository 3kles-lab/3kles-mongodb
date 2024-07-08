import * as mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { ExtendableError, AbstractGenericController } from '@3kles/3kles-corebe';
import { MongoDBService } from './mongodb.service';

export class MongoDBController extends AbstractGenericController {

	protected model: mongoose.Model<mongoose.Document>;

	constructor(service: MongoDBService) {
		super(service);

		this.model = service.model;
		this.execute.bind(this);
	}

	public execute(type: string): any {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				this.updateParamFromRequest(type, req);

				req.query.per_page = req.query.per_page && +req.query.per_page >= 0 ? req.query.per_page : '0';
				req.query.page = req.query.page && +req.query.page > 0 ? req.query.page : '1';

				const response = await this.service.execute(type, req);
				if (!response) throw new ExtendableError(type + '-not-found', 404);

				if (response.totalCount) {
					res.setHeader('Total-Count', response.totalCount);
				} else if (Array.isArray(response.data)) {
					res.setHeader('Total-Count', response.data.length);
				}

				res.json(response.data);
			} catch (err) {
				next(err);
			}
		};
	}

	public getParameters(): any {
		const data = {
			model: this.model,
			modelname: this.model.collection.collectionName
		};
		return data;
	}

	// Update parameters from req parameters
	// tslint:disable-next-line:no-empty
	public updateParamFromRequest(type: string, req: Request): void { }
}
