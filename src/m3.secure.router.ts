import { SecureRouter, IAuth } from '3kles-corebe';
import { M3Controller } from './m3.controller';
import { M3Utils } from './m3.utils';

// Class to create a M3 router from a M3Controller
export class M3SecureRouter extends SecureRouter {

	public addController(controller: M3Controller): void {
		console.log("Add controller:", controller.getParameters());
		M3Utils.addM3ControllerToRouter(this.router, controller);
	}

}
