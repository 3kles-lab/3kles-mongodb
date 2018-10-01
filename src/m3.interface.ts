import { IRequestParameter } from '3kles-corebe';

interface IM3Parameter extends IRequestParameter {
	api: string;
	transaction: string;
	inParameter?: any;
	outParameter?: any;
}

interface IMIRequest {
	results: IMIResult[];
	wasTerminated: boolean;
	nrOfSuccessfullTransactions: number;
	nrOfFailedTransactions: number;
}

interface IMIResult {
	transaction: string;
	records: any[];
	errorMessage?: string;
	errorType?: string;
	errorCode?: string;
	errorCfg?: string;
	errorField?: string;
}

export { IM3Parameter, IMIRequest, IMIResult };
