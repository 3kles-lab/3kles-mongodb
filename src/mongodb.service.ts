import * as mongoose from 'mongoose';
import { AbstractGenericService } from '3kles-corebe';

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
					console.log('Response from execute service=', response);
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
			return await this.model.find(filter);
		} catch (err) {
			throw err;
		}
	}

	// Get by id
	public async get(inputRequest: any): Promise<any> {
		console.log(inputRequest.params.id);
		try {
			return await this.model.findOne({ _id: inputRequest.params.id });
		} catch (err) {
			throw err;
		}
	}

	// add
	public async add(inputRequest: any): Promise<any> {
		const obj = new this.model(inputRequest.body);
		try {
			return await obj.save();
		} catch (err) {
			throw err;
		}
	}

	// Update by id
	public async update(inputRequest: any): Promise<any> {
		console.log('Data to update:', inputRequest.body);
		try {
			return await this.model.updateMany({ _id: inputRequest.params.id }, { $set: inputRequest.body });
		} catch (err) {
			throw err;
		}
	}

	// Delete by id
	public async delete(inputRequest: any): Promise<any> {
		try {
			return await this.model.findOneAndRemove({ _id: inputRequest.params.id });
		} catch (err) {
			throw err;
		}
	}

	public getModel(): any {
		return this.model;
	}
}
