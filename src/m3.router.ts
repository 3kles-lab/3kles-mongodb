import { GenericRouter } from '3kles-corebe';
import { M3Controller } from './m3.controller';
import { M3Utils } from './m3.utils';
// Class to create a M3 router from a GenericController
export class M3Router extends GenericRouter {

	public addController(controller: M3Controller): void {
		M3Utils.addM3ControllerToRouter(this.router, controller);
	}

}
