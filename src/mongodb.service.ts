import * as mongoose from 'mongoose';
import { AbstractGenericService, ExecuteOption } from '@3kles/3kles-corebe';
import { ExtendableError } from '@3kles/3kles-corebe';

export class MongoDBService extends AbstractGenericService {

	constructor(public model: mongoose.Model<mongoose.Document>) {
		super();
	}

	public async execute(type: string, data: any): Promise<any> {
		try {
			let response;
			switch (type) {
				case "list": {
					response = await this.list(data);
					break;
				}
				case "get": {
					response = await this.get(data);
					break;
				}
				case "add": {
					response = await this.add(data);
					break;
				}
				case "update": {
					response = await this.update(data);
					break;
				}
				case "delete": {
					response = await this.delete(data);
					break;
				}

			}
			return response;
		} catch (e) {
			throw e;
		}
	}

	// list
	public async list(inputRequest: any): Promise<any> {
		let filter = {};
		if (inputRequest.headers.filter) {
			filter = JSON.parse(inputRequest.headers.filter);
		}
		try {
			return {
				data: await this.model.find(filter).skip((+inputRequest.query.page - 1) * +inputRequest.query.per_page).limit(+inputRequest.query.per_page).lean<any>(),
				totalCount: await this.model.countDocuments(filter)
			};
		} catch (err) {
			throw err;
		}
	}

	// Get by id
	public async get(inputRequest: any): Promise<any> {
		try {
			const data: any = await this.model.findOne({ _id: inputRequest.params.id }).lean<any>();
			if (!data) {
				throw new ExtendableError(`Id ${inputRequest.params.id} not found`, 404);
			}
			return { data };
		} catch (err) {
			throw err;
		}
	}

	// add
	public async add(inputRequest: any): Promise<any> {
		const obj = new this.model(inputRequest.body);
		try {
			return { data: (await obj.save()).toObject() };
		} catch (err) {
			throw err;
		}
	}

	// Update by id
	public async update(inputRequest: any): Promise<any> {
		try {
			return { data: await this.model.updateMany({ _id: inputRequest.params.id }, { $set: inputRequest.body }).lean<any>() };
		} catch (err) {
			throw err;
		}
	}

	// Delete by id
	public async delete(inputRequest: any): Promise<any> {
		try {
			return { data: await this.model.findOneAndDelete({ _id: inputRequest.params.id }).lean<any>() };
		} catch (err) {
			throw err;
		}
	}

	public getModel(): any {
		return this.model;
	}
}
