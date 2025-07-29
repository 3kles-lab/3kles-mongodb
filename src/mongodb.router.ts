import { GenericController, GenericRouter } from '@3kles/3kles-corebe';
import { MongoDBController } from './mongodb.controller';
import { Router, RouterOptions } from 'express';

// Class to create a mongodb router from a GenericController
export class MongoDBRouter<T = any> extends GenericRouter {

	constructor(controller: MongoDBController<T>, options?: RouterOptions) {
		super(controller, options);
	}

	public addController(controller: MongoDBController<T>, checker?: any): void {

		const crudRouter = Router(this.options);
		crudRouter.route('/').get(controller.execute('list'));
		crudRouter.route('/:id').get(controller.execute('get'));
		crudRouter.route('/:id').put(controller.execute('update'));
		crudRouter.route('/:id').patch(controller.execute('update'));
		crudRouter.route('/').post(controller.execute('add'));
		crudRouter.route('/:id').delete(controller.execute('delete'));

		this.router.use(`/${controller.getParameters().modelname}`, crudRouter);
		super.addController(controller, checker);
	}

}
