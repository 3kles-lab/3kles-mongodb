import { Request } from 'express-validation';
import { GenericController, GenericService } from '3kles-corebe';

export class M3Controller extends GenericController {

	constructor(s: GenericService) {
		super(s);
	}

	// Update parameters from header parameters
	public updateParamFromRequest(type: string, req: Request): void {
		console.log('Update from Header!!');
		if (this.service.getParameters()) {
			if (req.headers.apihost) {
				this.service.getParameters()[type].host = req.headers.apihost;
			}
			if (req.headers.apiport) {
				this.service.getParameters()[type].port = req.headers.apiport;
			}
			if (req.headers.apiuser) {
				this.service.getParameters()[type].user = req.headers.apiuser;
			}
			if (req.headers.apipassword) {
				this.service.getParameters()[type].password = req.headers.apipassword;
			}
		}
		console.log('Parameters:', this.service.getParameters()[type]);
	}
}
