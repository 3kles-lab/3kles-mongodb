// import * as jwt from 'jsonwebtoken';
// import { NextFunction, Request, Response } from 'express-validation';
import { GenericService, GenericApp } from '3kles-corebe';
import { M3API } from './m3.api';
import { IM3Parameter } from './m3.interface';
import { M3Router } from './m3.router';
import { M3Controller } from './m3.controller';
import { M3SecureRouter } from './m3.secure.router';
import { M3AuthToken } from './m3.auth';

export class M3App extends GenericApp {

	constructor(params: IM3Parameter[], authParam?: IM3Parameter, middleware?: any) {
		super(middleware);
		const service: GenericService = new GenericService(new M3API(), params);
		const controller: M3Controller = new M3Controller(service);
		if (authParam) {
			this.router = new M3SecureRouter(new M3AuthToken(authParam), controller);
		} else {
			this.router = new M3Router(controller);
		}
		this.initRoute();
	}

	public getRouter(): any {
		return this.router;
	}

}
