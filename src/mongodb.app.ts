import mongoose from 'mongoose';
import express from 'express';
import fs from 'fs';
import { GenericApp } from '@3kles/3kles-corebe';
import { MongoDBHealth } from './mongodb.health';

// Class to create an Express Server from CRUD router and optional port
export class MongoDBApp extends GenericApp {
	private urlmongodb: string;
	private option: mongoose.ConnectOptions;

	constructor(public middleware?: string, public health?: MongoDBHealth) {
		super(middleware, health ? health : new MongoDBHealth());
	}

	public initAppVariable(): void {
		super.initAppVariable();
		// DB CONFIG
		this.app.set('DB_ACTIVE', process.env.DB_ACTIVE || false);
		this.app.set('DB_HOST', process.env.DB_HOST || 'localhost');
		this.app.set('DB_PORT', process.env.DB_PORT || 0);
		this.app.set('DB_USER', process.env.DB_USER || '');
		this.app.set('DB_PWD', process.env.DB_PWD || '');
		this.app.set('DB_DBNAME', process.env.DB_DBNAME || '');
		this.app.set('DB_PROTOCOL', process.env.DB_PROTOCOL || 'mongodb');
		this.app.set('DB_OPTIONS', process.env.DB_OPTIONS);
		this.app.set('DB_CERT', process.env.DB_CERT);
		this.app.set('DB_KEY', process.env.DB_KEY);
	}

	public async initModule(): Promise<void> {
		super.initModule();
		this.createMongoURLEnvVariable();
		this.initOption();

		if (this.app.get('DB_ACTIVE') === 'true') {
			// mongoose.set('debug', true); // TODO
			if (process.env.NODE_ENV === 'developement') {
				mongoose.set('debug', true);
			}
			console.log('URL Mongodb=', this.urlmongodb);
			await mongoose.connect(this.urlmongodb, this.option);

			const db = mongoose.connection;
			(mongoose as any).Promise = global.Promise;

			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', () => {
				console.log('Connected to MongoDB');
			});
			db.on('connected', () => {
				console.log('MongoDB connected!');
			});
			db.on('reconnected', () => {
				console.log('MongoDB reconnected!');
			});
			db.on('disconnected', () => {
				console.log('MongoDB disconnected!');
			});
		} else {
			this.app.use('/', (err, res) => {
				res.send('DB Not activated');
			});
		}
	}

	public createMongoURLEnvVariable(): string {
		return this.createMongoURL(this.app.get('DB_HOST'),
			this.app.get('DB_PORT'),
			this.app.get('DB_DBNAME'),
			this.app.get('DB_USER'),
			this.app.get('DB_PWD')
		);
	}

	public createMongoURL(host: string, port: number, dbname: string, user?: string, password?: string): string {
		console.log('DBNAME=', dbname);
		// this.urlmongodb = 'mongodb://';
		console.log('DB_PROTOCOL=', this.app.get('DB_PROTOCOL'));
		this.urlmongodb = this.app.get('DB_PROTOCOL') + '://';
		if (user) {
			this.urlmongodb += user + ':' + password + '@';
		}
		if (port === 0) {
			this.urlmongodb += host + '/' + dbname;
		} else {
			this.urlmongodb += host + ':' + port + '/' + dbname;
		}
		if (this.app.get('DB_OPTIONS')) {
			this.urlmongodb += '?' + this.app.get('DB_OPTIONS');
		}
		return this.urlmongodb;
	}

	public initOption(): void {
		this.option = {};
		const dbCertificate = this.app.get('DB_CERT');
		const dbKey = this.app.get('DB_KEY');
		if (dbCertificate && dbKey) {
			this.option = {
				...this.option,
				ssl: true,
				sslValidate: true,
				authMechanism: 'MONGODB-X509',
				sslCert: dbCertificate,
				sslKey: dbKey
			};
		}
	}

	public getMongoose(): mongoose.Mongoose {
		return mongoose;
	}

	public getRouter(): any {
		return this.router;
	}

	public addRoute(router: express.Router, m?: any): void {
		if (m) {
			this.app.use('/' + m, router);
		} else if (this.middleware) {
			this.app.use('/' + this.middleware, router);
		} else {
			this.app.use('/', router);
		}
	}
}
