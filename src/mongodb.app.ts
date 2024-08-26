import mongoose from 'mongoose';
import express from 'express';
import { ExtendableError, GenericApp } from '@3kles/3kles-corebe';
import { MongoDBHealth } from './mongodb.health';
import fs from 'fs';

// Class to create an Express Server from CRUD router and optional port
export class MongoDBApp extends GenericApp {
	private urlmongodb: string;
	private connectOptions: mongoose.ConnectOptions;

	constructor(public middleware?: string, public health?: MongoDBHealth, public option?: any) {
		super(middleware, health ? health : new MongoDBHealth(), option);
	}

	public initAppVariable(): void {
		super.initAppVariable();
		// DB CONFIG
		this.app.set('DB_ACTIVE', process.env.DB_ACTIVE ? process.env.DB_ACTIVE === 'true' : true);
		this.app.set('DB_HOST', process.env.DB_HOST || 'localhost');
		this.app.set('DB_PORT', process.env.DB_PORT || 0);
		this.app.set('DB_USER', process.env.DB_USER || '');
		this.app.set('DB_PWD', process.env.DB_PWD || '');
		this.app.set('DB_DBNAME', process.env.DB_DBNAME || '');
		this.app.set('DB_PROTOCOL', process.env.DB_PROTOCOL || 'mongodb');
		this.app.set('DB_OPTIONS', process.env.DB_OPTIONS);
		this.app.set('DB_CERT', process.env.DB_CERT);
		this.app.set('DB_KEY', process.env.DB_KEY);
		this.app.set('DB_CAFILE', process.env.DB_CAFILE);
		this.app.set('DB_KEY_CERT', process.env.DB_KEY_CERT);
	}

	public async initModule(): Promise<void> {
		super.initModule();
		this.createMongoURLEnvVariable();
		this.initOption();

		if (this.app.get('DB_ACTIVE')) {
			// mongoose.set('debug', true); // TODO
			if (process.env.NODE_ENV === 'developement') {
				mongoose.set('debug', true);
			}
			await mongoose.connect(this.urlmongodb, this.connectOptions);

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
		this.connectOptions = {};
		const dbCertificate = this.app.get('DB_CERT');
		const dbCAFile = this.app.get('DB_CAFILE');
		const dbKey = this.app.get('DB_KEY');
		const tlsCertificateKeyFile = this.app.get('DB_KEY_CERT');

		if (dbCertificate || dbKey || tlsCertificateKeyFile) {
			this.connectOptions = {
				...this.connectOptions,
				tls: true,
				authMechanism: 'MONGODB-X509',
				...(tlsCertificateKeyFile && { tlsCertificateKeyFile }),
				...(dbCAFile && { tlsCAFile: dbCAFile }),
				...(dbCertificate && { cert: fs.readFileSync(dbCertificate) }),
				...(dbKey && { key: fs.readFileSync(dbKey) }),
			};
		}
	}

	public getMongoose(): mongoose.Mongoose {
		return mongoose;
	}

	public getRouter(): any {
		return this.router;
	}

	protected errorHandler(err: ExtendableError, req: express.Request, res: express.Response, next: express.NextFunction): void {
		if (err instanceof mongoose.mongo.MongoError) {
			switch (err.code) {
				case 11000:
					res.status(409).json({ error: err.errmsg });
					break;
				default:
					super.errorHandler(err, req, res, next);
			}
		} else {
			super.errorHandler(err, req, res, next);
		}
	}
}
