import { GenericRouter } from '@3kles/3kles-corebe';
import { MongoDBController } from './mongodb.controller';

// Class to create a mongodb router from a GenericController
export class MongoDBRouter extends GenericRouter {

	constructor(controller: MongoDBController) {
		super(controller);
	}

	public addController(controller: MongoDBController): void {
		this.router.route('/' + controller.getParameters().modelname + '/').get(controller.execute('list'));
		this.router.route('/' + controller.getParameters().modelname + '/:id').get(controller.execute('get'));
		this.router.route('/' + controller.getParameters().modelname + '/:id').put(controller.execute('update'));
		this.router.route('/' + controller.getParameters().modelname + '/:id').patch(controller.execute('update'));
		this.router.route('/' + controller.getParameters().modelname).post(controller.execute('add'));
		this.router.route('/' + controller.getParameters().modelname + '/:id').delete(controller.execute('delete'));
	}
}
