import { GenericHealth } from '@3kles/3kles-corebe';
import mongoose from 'mongoose';

export class MongoDBHealth extends GenericHealth {
	public async status(): Promise<any> {
		const status = await super.status();

		const db = {
			host: mongoose.connection.host,
			port: mongoose.connection.port,
			collections: Object.keys(mongoose.connection.collections),
			state: mongoose.STATES[mongoose.connection.readyState]
		};

		return { ...status, db };
	}
}