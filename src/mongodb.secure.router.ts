import { SecureRouter } from '3kles-corebe';
import { MongoDBController } from './mongodb.controller';

// Class to create a mongodb router from a mongodbController
export class MongoDBSecureRouter extends SecureRouter {

	public addController(controller: MongoDBController): void {
		this.router.route('/' + controller.getParameters().model + '/list').get(controller.execute('list'));
		this.router.route('/' + controller.getParameters().model + '/:id').get(controller.execute('get'));
		this.router.route('/' + controller.getParameters().model + '/:id').put(controller.execute('update'));
		this.router.route('/' + controller.getParameters().model).post(controller.execute('add'));
		this.router.route('/' + controller.getParameters().model + '/:id').delete(controller.execute('delete'));
	}

}
