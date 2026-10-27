import { SecureRouter, GenericRouterOptions, IAuth } from '@3kles/3kles-corebe';
import { MongoDBController } from './mongodb.controller';

// Class to create a mongodb router from a mongodbController
export class MongoDBSecureRouter<T = any> extends SecureRouter {

    constructor(auth: IAuth, controller?: MongoDBController<T>, options?: GenericRouterOptions) {
        super(auth, undefined, options);
        if (controller) {
            this.useBodyParser('/' + controller.getParameters().model);
            this.addController(controller);
        }
    }

	public addController(controller: MongoDBController<T>): void {
        this.useBodyParser('/' + controller.getParameters().model);
		this.router.route('/' + controller.getParameters().model + '/').get(controller.execute('list'));
		this.router.route('/' + controller.getParameters().model + '/:id').get(controller.execute('get'));
		this.router.route('/' + controller.getParameters().model + '/:id').put(controller.execute('update'));
		this.router.route('/' + controller.getParameters().model + '/:id').patch(controller.execute('update'));
		this.router.route('/' + controller.getParameters().model).post(controller.execute('add'));
		this.router.route('/' + controller.getParameters().model + '/:id').delete(controller.execute('delete'));
	}

}
