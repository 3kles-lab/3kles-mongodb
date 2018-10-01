import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express-validation';
import { AbstractAuthToken, GenericService, IRequestParameter } from '3kles-corebe';
import { M3API } from './m3.api';
import { IM3Parameter } from './m3.interface';

export class M3AuthToken extends AbstractAuthToken {

	private staticroute: string = "authentication";

	constructor(params?: IM3Parameter) {
		super(params);
		console.log('M3AuthToken:', this.parameters);
	}

	// Implementation authenticate method throught M3 profile
	public async authenticate(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			this.parameters.user = req.headers.user;
			this.parameters.password = req.headers.password;
			console.log('Call auth:', this.parameters);
			const listParam: IM3Parameter[] = [];
			listParam[this.staticroute] = this.parameters;
			this.updateParamFromRequest(this.staticroute, req);
			const service: GenericService = new GenericService(new M3API(), listParam);
			console.log(service.getParameters());
			const response = await service.execute(this.staticroute, req.body);
			const payload = { user: req.headers.user };
			const token = jwt.sign(payload, this.secretKey, { expiresIn: this.expiredTime });
			res.set('token', token);
			return res.status(200).json(response);
		} catch (err) {
			next(err);
		}
	}

	public async checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.headers.token) {
			jwt.verify(req.headers.token, this.secretKey, (err, decodedToken) => {
				if (err) {
					res.status(403).send({ success: false, message: "Invalid token" });
				} else {
					const payload = { user: decodedToken.user };
					const token = jwt.sign(payload, this.secretKey, { expiresIn: this.expiredTime });
					res.set('token', token);
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No token." });
		}
	}

	// Update parameterss from header parameters
	public updateParamFromRequest(type: string, req: Request): void {
		console.log('Update from Header!!');
		if (this.parameters) {
			if (req.headers.apihost) {
				this.parameters[type].host = req.headers.apihost;
			}
			if (req.headers.apiport) {
				this.parameters[type].port = req.headers.apiport;
			}
		}
		console.log('Parameters:', this.parameters[type]);
	}
}
