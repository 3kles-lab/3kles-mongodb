import { IRequestParameter } from '3kles-corebe';

interface IMongoDBParameter extends IRequestParameter {
	api: string;
	transaction: string;
	inParameter?: any;
	outParameter?: any;
}

export { IMongoDBParameter };
