import * as mongoose from 'mongoose';
import { AbstractGenericService, ServiceParams, ServiceResponse } from '@3kles/3kles-corebe';
import { ExtendableError } from '@3kles/3kles-corebe';

export class MongoDBService<T = any> extends AbstractGenericService {
    constructor(
        public model: mongoose.Model<T>,
        params?: ServiceParams,
    ) {
        super(params);
    }

    public async execute(type: string, data: any): Promise<ServiceResponse | undefined> {
        let response;
        switch (type) {
            case 'list': {
                response = await this.list(data);
                break;
            }
            case 'get': {
                response = await this.get(data);
                break;
            }
            case 'add': {
                response = await this.add(data);
                break;
            }
            case 'update': {
                response = await this.update(data);
                break;
            }
            case 'delete': {
                response = await this.delete(data);
                break;
            }
        }
        return response;
    }

    // list
    public async list(inputRequest: any): Promise<ServiceResponse> {
        let filter = {};
        if (inputRequest.headers.filter) {
            filter = JSON.parse(inputRequest.headers.filter);
        }
        return {
            data: await this.model
                .find(filter)
                .skip((+inputRequest.query.page - 1) * +inputRequest.query.per_page)
                .limit(+inputRequest.query.per_page)
                .lean<any>(),
            headers: {
                'total-count': await this.model.countDocuments(filter),
            },
            type: 'json',
        };
    }

    // Get by id
    public async get(inputRequest: any): Promise<ServiceResponse> {
        const data: any = await this.model.findOne({ _id: inputRequest.params.id }).lean<T>();
        if (!data) {
            throw new ExtendableError(`Id ${inputRequest.params.id} not found`, 404);
        }
        return { data, type: 'json' };
    }

    // add
    public async add(inputRequest: any): Promise<ServiceResponse> {
        const obj = new this.model(inputRequest.body);
        return { data: (await obj.save()).toObject(), type: 'json' };
    }

    // Update by id
    public async update(inputRequest: any): Promise<ServiceResponse> {
        return {
            data: await this.model.findByIdAndUpdate(inputRequest.params.id, { $set: inputRequest.body }).lean<T>(),
            type: 'json',
        };
    }

    // Delete by id
    public async delete(inputRequest: any): Promise<ServiceResponse> {
        return { data: await this.model.findOneAndDelete({ _id: inputRequest.params.id }).lean<T>(), type: 'json' };
    }

    public getModel(): mongoose.Model<T> {
        return this.model;
    }
}
